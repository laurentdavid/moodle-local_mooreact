<?php

namespace local_mooreact\route\controller;

use core\router;
use core\router\require_login;
use core\router\route;
use core\router\schema\parameters\query_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class react_apps_controller {
    use \core\router\route_controller;

    /**
     * Constructor for the react apps handler.
     *
     * @param \core\router $router The router.
     */
    public function __construct(
        /** @var router The routing engine */
        private router $router,
    ) {
    }

    /**
     * Handle the react app page.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/apps',
        method: ['GET', 'POST'],
        requirelogin: new require_login(
            requirelogin: true,
            courseattributename: 'course',
        ),
        queryparams: [
            new query_parameter(
                name: 'appname',
                type: \core\param::ALPHANUMEXT,
                default: 'firstapp',
            ),
        ],
    )]
    public function app_handler(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        global $CFG, $PAGE, $OUTPUT, $ME;

        $context = \core\context\system::instance();

        $appname = $request->getQueryParams()['appname'] ?? 'firstapp';
        $title = get_string('apptitle', 'local_mooreact', $appname);
        $PAGE->set_url('/react');
        $PAGE->set_context($context);
        $PAGE->set_title($title);
        $PAGE->set_heading($title);
        $PAGE->navbar->add($title);

        // First check if there are templates that match this name.

        $dirs = \core\output\mustache_template_finder::get_template_directories_for_component('local_mooreact', $PAGE->theme->name);

        $templatefound = false;
        foreach ($dirs as $dir) {
            $candidate = $dir . $appname . '.mustache';
            if (file_exists($candidate)) {
                $templatefound = true;
            }
        }



        if (!$templatefound) {
            // No template found. Redirect to the home page.
            $response = $this->router->get_app()->getResponseFactory()->createResponse(404);
            $response->getBody()->write($OUTPUT->header());
            $response->getBody()->write($OUTPUT->notification(get_string('pagenotexist', 'error', s($ME)), 'error'));
            $response->getBody()->write($OUTPUT->supportemail(['class' => 'text-center d-block mb-3 fw-bold']));
            $response->getBody()->write($OUTPUT->continue_button($CFG->wwwroot));
            $response->getBody()->write($OUTPUT->footer());
            return $response;
        }

        // This allows the webserver to dictate wether the http status should remain
        // what it would have been, or force it to be a 404. Under other conditions
        // it could most often be a 403, 405 or a 50x error.
        $code = 200;
        $response = $this->router->get_app()->getResponseFactory()->createResponse($code);
        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading($title));
        $response->getBody()->write($OUTPUT->render_from_template('local_mooreact/' . $appname, [
            'appname' => $appname,
        ]));
        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }
}

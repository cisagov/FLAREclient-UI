Moderate issue
- docker/local-development/nginx.conf.tpl: The web-application does not define an HSTS header, leaving it vulnerable to attack.

Low issue
- The application uses the hard-coded password for authentication purposes, either
  using it to verify users' identities, or to access another remote system.
    * line 87 of src/js/pages/ServerManagement/EditServer/EditServerForm.js
    * line 21 of src/js/api/mock/mock_account.js 
    * line 22 of src/tests/unit/redux/actions/account.test.js
    * line 20 of src/js/pages/Login/LoginForm.js
    * line 45 of src/js/pages/ServerManagement/EditServer/EditServerForm.js
- The application contains passwords embedded in source code comments at:
    * line 185 of src/js/pages/UserManagement/EditUser/EditUserForm.js
    * line 233 of src/js/pages/UserManagement/EditUser/EditUserForm.js
- The application uses the empty password for authentication purposes, either using it
      to verify users' identities, or to access another remote system. This empty password is set at:
    * line 20 of src/js/pages/Login/LoginForm.js
    * line 72 of src/tests/unit/redux/actions/server.test.js
    * line 87 of src/js/pages/ServerManagement/EditServer/EditServerForm.js
      These empty password appears in the code, cannot be changed without rebuilding the application and indicates its associated account is exposed.
- React Deprecate
    * Method ReactDOM.render in src/js/index.js, at line 23
    * Method LoginView in src/js/pages/Login/index.js
- Unprotected Cookies - 
    * GuestRedirect method creates a cookie jwt_token at line 10 of src/js/routes/GuestRedirect.js
    * LoginView method creates a cookie jwt_token at line 57 of src/js/pages/Login/index.js
- The JavaScript file imported in https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap in public/index.html at line 24 is from a remote domain, which may allow attackers to replace its contents with malicious code
- The application does not protect the web page public/index.html from clickjacking attacks in legacy browsers, by using framebusting scripts.
- A Content Security Policy is not explicitly defined within the web-application at line 13 of config/jest/fileTransform.js
       
## STANDART API

{root.api}/{version}/{grouping}/{endpoint}

{root.api} = http://localhost:5000

SAMPLE DOMAIN LOCAL : 
http://localhost:5000/v1/auth/login

GROUP : Authentication

[1] - Register

POST - {root.api}/v1/auth/register

    req: {
            "email" : "coba@gmail.com",
            "name" : "Pahrul",
            "password" : "123",
            "confPassword" : "123"
        }
        
[2] - Verify Email

POST - {root.api}/v1/auth/register

[3] - Login

POST - {root.api}/v1/auth/login

[4] - Forgot Password 

POST - {root.api}/v1/auth/forget-password

[5] - New Password

POST - {root.api}/v1/auth/new-password?{query}={token} - CLIENT SIDE

[6] - Logout

DELETE - {root.api}/v1/auth/logout

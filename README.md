# Routes

## Authorization

### /auth/signup

User-Model:

id: number,
email: string,
user_name: string,
password: string,
created_at: Date

Body: 

  email: string, 
  user_name: string,
  password: string,
  password_repeat: string,

Response (OK):

  {
    message: string,
    accessToken: string,
    refreshToken: string,
    user: User
  }

Response (ERROR):

{
  status: number,
  message: string
} 
Или
{
  status: number,
  errors: {type: string, message: string}[],
  mainMessage: string
}

### /auth/login

Body: 

  email_or_user_name: string, 
  password: string,

Response (OK):

  {
    message: string,
    accessToken: string,
    refreshToken: string,
    user: User
  }

Response (ERROR):

{
  status: number,
  message: string
} 

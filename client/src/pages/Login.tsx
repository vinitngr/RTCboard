
function Login() {
    console.log(import.meta.env.VITE_NODE_ENV);
  return (
    <div>
        <div>Login</div>
        <form method="post" action={import.meta.env.NODE_ENV === 'development' ? "http://localhost:3000/api/auth/login" : 'https://production.com/api/auth/login'}>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login
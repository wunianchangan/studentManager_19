let express=require('express');
let svgCaptcha=require('svg-captcha');
let path=require('path');
let session=require('express-session');
let bodyParser = require('body-parser')


// 开启服务
let app=express();

//设置托管静态资源
app.use(express.static('static'));

//开启session中间件
app.use(session({
    secret: 'keyboard cat'
  }));
//   开启bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }));

//路由1  用户进入登录界面
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})
//路由2  登录进入首页
app.post('/login',(req,res)=>{
    //接受数据
    let userName=req.body.userName;
    let userPass=req.body.userPass;
    let check=req.body.check;
    // 检查是否登录成功
    if(check==req.session.captcha){
        //登录成功，保存用户信息，跳转首页
        req.session.userInfo={
            userName,
            userPass
        }
        res.redirect('/index')
    }else{
        // 转回登录页
        res.setHeader('content-type', 'text/html');
        res.send('<script>alert("验证码失败");window.location.href="/login"</script>');
    }
})

//路由3  验证码请求
app.get('/login/captchaImg',(req,res)=>{
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLocaleLowerCase();
    // console.log(req.session.captcha);
    
    // console.log(captcha.text);
    
    res.type('svg');
    res.status(200).send(captcha.data);
})
//路由4 访问首页
app.get('/index',(req,res)=>{
    if(req.session.userInfo){
        // 有session 读取并返回首页
        res.sendFile(path.join(__dirname,'static/views/index.html'))
    }else{
        // 没有session 返回登录页
        res.setHeader('content-type', 'text/html');
        res.send("<script>alert('请登录');window.location.href='/login'</script>");
    }
})
// 路由5  登出
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    res.redirect('/login');
})
// 路由6 注册跳转
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/register.html'));
})
// 路由7  注册用户
app.post('/register',(req,res)=>{
    let userName=req.body.userName;
    let userPass=req.body.userPass;
    
    
    
})


app.listen(80,'127.0.0.1',()=>{
    console.log('success');
    
})
<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

const loginData = ref({
    username: '',
    password: '',
})

//repassword校验规则
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

//定义表单校验规则
const rules = {
    username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    rePassword:[
        {validator:checkRePassword, trigger: 'blur'}
    ]
}

//调用后台接口注册
import { userRegisterService,userLoginService } from '@/api/user.js'
const register = async() => {
    //registerdata是响应式对象，所以要用registerData.value
    
    let result = await userRegisterService(registerData.value)
    if (result.code === 0){
        //注册成功
        ElMessage.success(result.msg? result.msg:'注册成功')
    }else{
        //注册失败
        ElMessage.error('注册失败')
    }
}

//调用后台接口登录
import {useRouter} from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
const router = useRouter();
const tokenStore = useTokenStore();

const login = async() => {
    //loginData是响应式对象，所以要用loginData.value
    let result = await userLoginService(loginData.value)
    if (result.code === 0){
        //登录成功
        ElMessage.success(result.msg? result.msg:'登录成功')
        //存储token
        tokenStore.setToken(result.data)
        router.push('/')
    }else{
        //登录失败
        ElMessage.error('登录失败')
    }
}


//根据宽高比判断是否为移动端
import { onMounted, onUnmounted } from 'vue';

const isPortrait = ref(false);

const checkIsPortrait = () => {
    isPortrait.value = window.innerWidth / window.innerHeight < 1;
};

onMounted(() => {
    checkIsPortrait();
    window.addEventListener('resize', checkIsPortrait);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkIsPortrait);
});

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg" v-if="!isPortrait"></el-col>
        <el-col :span="isPortrait ? 24 :12" :offset="0" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="medium" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="loginData" :rules="rules" @keyup.enter="login">   <!--复用登陆表单-->
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
@media (orientation: Landscape){
    .login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        padding: calc(10%) ;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
}

@media (orientation: portrait) {
    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
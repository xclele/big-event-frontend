<script setup>
import { ref } from 'vue'

const resetPwdData = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

//修改完重新登录
import useUserInfoStore from '@/stores/userInfo.js';
import { useTokenStore } from '@/stores/token.js';
import router from '@/router';

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const reLogin = () => {
    tokenStore.removeToken();
    userInfoStore.removeInfo();
    router.push('/login');
}

//更新个人密码
import { userPasswordUpdateService } from '@/api/user'
import { ElMessage } from 'element-plus';
const userPasswordUpdate = async() =>{
    console.log(resetPwdData.value)
    let result = await userPasswordUpdateService(resetPwdData.value)
    if (result.code === 0){
        //修改成功
        ElMessage.success(result.message? result.message:'修改成功')
        userInfoStore.setInfo(userInfo.value)
        reLogin()
        ElMessage({type: 'success',message: '密码已修改，请用新密码重新登陆',});
    }else{
        //修改失败
        ElMessage.error('修改失败')
    }
}

const rules = {
    old_pwd: [
        { required: true, message: '请输入当前密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '密码长度在 5 到 16 个字符', trigger: 'blur' }
    ],
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="resetPwdData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="resetPwdData.old_pwd" show-password="false"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="resetPwdData.new_pwd" show-password="false"></el-input>
                    </el-form-item>
                    <el-form-item label="重复新密码" prop="re_pwd">
                        <el-input v-model="resetPwdData.re_pwd" show-password="false"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="userPasswordUpdate">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
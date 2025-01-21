<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categories = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娱乐",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "军事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

//控制添加分类弹窗
const dialogVisible = ref(false)
//控制删除确认弹窗
const deleteDialogVisible = ref(false)
//弹窗title
const title=ref('')

//显示编辑弹窗
const showEditDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑分类';
    //数据拷贝
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //扩展id属性
    categoryModel.value.id = row.id;
}

//显示删除确认弹窗
const showDeleteDialog = (row) => {
    deleteDialogVisible.value = true;
    //数据拷贝
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //读取id属性
    categoryModel.value.id = row.id;
}

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}

//按照分类获取文章列表
import { articleCategoryListService,addCategoryService,updateCategoryService,deleteCategoryService } from '@/api/article.js'
import { ElMessage } from 'element-plus'

const articleCategoryList = async() => {
    let result = await articleCategoryListService();
    categories.value = result.data;
}
articleCategoryList();  //调用函数

//添加分类
const addCategory = async() => {
    //调用接口添加分类
    let result = await addCategoryService(categoryModel.value);
    ElMessage.success(result.message ? result.message : '添加成功');

    //刷新列表并关闭弹窗
    articleCategoryList();
    dialogVisible.value = false;
}

//编辑分类
const updateCategory = async() => {
    //调用接口编辑分类
    let result = await updateCategoryService(categoryModel.value);
    ElMessage.success(result.message ? result.message : '修改成功');

    //刷新列表并关闭弹窗
    articleCategoryList();
    dialogVisible.value = false;
}

//删除分类
const deleteCategory = async() => {
    //调用接口删除分类
    console.log(categoryModel.value.id)
    let result = await deleteCategoryService(categoryModel.value.id);
    ElMessage.success(result.message ? result.message : '删除成功');

    //刷新列表
    articleCategoryList();
    deleteDialogVisible.value = false;
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="title='添加分类';dialogVisible = true">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categories" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="showDeleteDialog(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加，编辑分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="400">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title==='添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

        <!--删除确认弹窗-->
        <el-dialog title="提示" v-model="deleteDialogVisible" width="400">
            <span>确认删除该分类吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteCategory()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>

    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

</style>
<template>
  <d2-container>
    <template slot="header">
      <el-row class="header">
        <el-button
          type="success"
          @click="
            resetForm();
            dialogFormVisible = true;
            addFlag = true;
          "
          round
          >添加公司</el-button
        >
        <el-button
          type="warning"
          @click="
            resetForm();
            dialogFormVisible = true;
            addFlag = true;
          "
          round
          >从Excel导入公司</el-button
        >
        <el-button
          @click="getCompanyList()"
          style="float:right"
          icon="el-icon-search"
        ></el-button>
        <el-input
          v-model="keywords"
          style="float:right;width:20%;"
          placeholder="根据公司名查询"
        ></el-input>
      </el-row>
    </template>
    <template>
      <el-table
        :key="itemkey"
        id="companyTable"
        border
        :data="companyData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="公司名"
          width="180"
        ></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="account" label="账户"></el-table-column>
        <el-table-column prop="contact_person" label="联系人"></el-table-column>
        <el-table-column
          prop="contact_number"
          label="联系电话"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                getOneCompanyList(companyData[scope.$index].id);
                dialogFormVisible = true;
                editFlag = true;
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      @close="clearVisible()"
    >
      <el-form
        ref="companyForm"
        :model="form"
        label-position="left"
        size="small"
        autocomplete="off"
      >
        <el-form-item label="公司id" v-show="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" ref="name"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" ref="address"></el-input>
        </el-form-item>
        <el-form-item label="公司账户" :label-width="formLabelWidth">
          <el-input v-model="form.account" ref="account"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input
            v-model="form.contact_person"
            ref="contact_person"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input
            v-model="form.contact_number"
            ref="contact_number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearVisible()">取 消</el-button>
        <el-button
          type="primary"
          v-if="addFlag"
          @click="
            addCompany();
            clearVisible();
          "
          >确 定</el-button
        >
        <el-button
          type="primary"
          v-if="editFlag"
          @click="
            editCompany(form.id);
            clearVisible();
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-pagination
      center
      background
      layout="prev, pager, next"
      :total="total_count"
      :page-size="8"
      @current-change="getCompanyList"
      :current-page.sync="currentPage1"
    >
    </el-pagination>
  </d2-container>
</template>

<script>
export default {
  name: "page1",
  data() {
    return {
      companyData: [],
      a: 1000,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      editFlag: false,
      addFlag: false,
      form: {
        name: "",
        address: "",
        account: "",
        contact_person: "",
        contact_number: ""
      },
      total_count: 0,
      currentPage1: 1,
      page_size: "",
      itemkey: "",
      keywords: "",
      loading: true
    };
  },
  methods: {
    async getCompanyList(page = 1) {
      try {
        this.loading = true
        const res = await this.$api.getList(
          "company",
          page,
          `name=${this.keywords}`
        );
        if (res) this.loading = false
        this.currentPage1 = page;
        this.companyData = res._list;
        this.total_count = +res.total_count;

      } catch (error) {
        console.log(error);
      }
    },
    async getOneCompanyList(id) {
      try {
        const res = await this.$api.getOneList("company", id);
        this.form = res;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCompany(id) {
      try {
        console.log(id);
        const res = await this.$api.deleteList("company", { cid: id }, id);
      } catch (error) {
        console.log(error);
      }
    },
    async editCompany(id) {
      try {
        const res = await this.$api.editList("company", this.getJSON(), id);
        if (res) {
          setTimeout(this.getCompanyList(1), 1000); // 调用接口重新渲染表格
          this.$notify({
            title: "成功",
            message: "编辑成功",
            type: "success"
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addCompany() {
      try {
        const res = await this.$api.addList("company", this.getJSON());
        console.log(res);
        this.$notify({
          title: "成功",
          message: "添加成功",
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    },
    getJSON() {
      let form = this.form;
      return {
        name: form.name,
        address: form.address,
        account: form.account,
        contact_person: form.contact_person,
        contact_number: form.contact_number
      };
    },
    resetForm() {
      for (let i in this.form) {
        this.form[i] = "";
      }
    },
    handleDelete(i) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCompany(this.companyData[i].id);
          setTimeout(this.getCompanyList, 1000); // 调用接口重新渲染表格
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clearVisible() {
      this.dialogFormVisible = false;
      this.addFlag = false;
      this.editFlag = false;
    }
  },
  mounted() {
    this.getCompanyList();
  }
};
</script>
<style lang="scss" scope>
h3 {
  margin-top: 0;
}

.el-pagination {
  padding-top: 20px;
  text-align: center;
}
</style>

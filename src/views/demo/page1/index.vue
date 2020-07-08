<template>
  <d2-container>
    <template slot="header">公司列表</template>
    <template>
      <el-table border :data="companyData" style="width: 100%">
        <el-table-column type="index" label="编号" width="80"></el-table-column>
        <el-table-column
          prop="name"
          label="公司名"
          width="180"
        ></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            > -->
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
  </d2-container>
</template>

<script>
export default {
  name: "page1",
  methods: {
    async getTableData() {
      try {
        const res = await this.$api.getCompanyList();
        this.companyData = res;
      } catch (error) {
        console.log(error);
      }
    },
    handleDelete() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
    }
  },
  data() {
    return {
      companyData: [
        {
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          account: "上海市普陀区金沙江路 1518 弄",
          contact_person: "",
          contact_number: ""
        }
      ]
    };
  },
  created() {
    this.getTableData();
  }
};
</script>

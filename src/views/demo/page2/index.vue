<template>
  <d2-container>
    <template slot="header">
      <el-row class="header">
        <el-button
          type="success"
          @click="
            resetForm();
            loadCompany();
            dialogFormVisible = true;
            addFlag = true;
          "
          round
          >添加合同</el-button
        >
        <!-- <el-button
          type="warning"
          @click="
            resetForm();
            dialogFormVisible = true;
            addFlag = true;
          "
          round
          >从Excel导入公司</el-button
        > -->
        <el-button
          @click="getContractList()"
          style="float:right"
          icon="el-icon-search"
        ></el-button>
        <el-input
          v-model="keywords"
          style="float:right;width:20%;"
          placeholder="根据合同名称查询"
        ></el-input>
      </el-row>
    </template>
    <template>
      <el-table
        :key="itemkey"
        id="contractTable"
        border
        :data="contractData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="number"
          label="合同编号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="合同名称"
          width="130"
        ></el-table-column>
        <el-table-column prop="status" label="合同状态" width="94">
          <template slot-scope="scope">
            <span style="font-weight:bold;color:green" v-if="scope.row.status"
              >【在期】</span
            >
            <span style="font-weight:bold;color:red" v-if="!scope.row.status"
              >【已过期】</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="expire_time"
          label="过期时间"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="合同内容"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="partyA"
          label="甲方"
          width="135"
        ></el-table-column>
        <el-table-column
          prop="partyB"
          label="乙方"
          width="135"
        ></el-table-column>
        <!-- <el-table-column prop="remarks" label="备注"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="
                getService(contractData[scope.$index].id);
                dialogDetailVisible = true;
                editFlag = true;
              "
              >查看详情</el-button
            >
            <el-button
              size="mini"
              @click="
                getOneContractList(contractData[scope.$index].id);
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

    <!-- 添加合同start -->
    <el-dialog
      title="添加合同"
      :visible.sync="dialogFormVisible"
      @close="clearVisible()"
    >
      <el-form
        ref="contractForm"
        :model="form"
        label-position="left"
        size="small"
        autocomplete="off"
        :label-width="formLabelWidth"
      >
        <el-form-item label="公司id" v-show="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input placeholder="编号将自动生成/不可编辑" disable></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="form.name" ref="name"></el-input>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="form.expire_time"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同内容" type="textarea">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="备注" type="textarea">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item label="选择甲方">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择乙方">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearVisible()">取 消</el-button>
        <el-button
          type="primary"
          v-if="addFlag"
          @click="
            addContract();
            clearVisible();
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加合同end -->

    <!-- 查看详情start -->
    <el-dialog title="服务详情" :visible.sync="dialogDetailVisible" width="30%">
      <el-form
        ref="serviceDetailForm"
        :model="serviceform"
        label-position="left"
        size="small"
        autocomplete="off"
      >
        <el-form-item label="服务id" v-show="false">
          <el-input v-model="serviceform.id" disable="lock"></el-input>
        </el-form-item>
        <el-form-item label="服务名">
          <el-input v-model="serviceform.name" :disabled="lock"></el-input>
        </el-form-item>
        <el-form-item label="结算方式">
          <el-input v-model="serviceform.pay_way" :disabled="lock"></el-input>
        </el-form-item>
        <el-form-item label="每日结算日(区间)">
          <el-input v-model="serviceform.monthly_pay_range" :disabled="lock"></el-input>
        </el-form-item>
        <el-form-item label="实际使用量">
          <el-input v-model="serviceform.usage_balance" :disabled="lock"></el-input>
        </el-form-item>
        <el-form-item label="余额">
          <el-input v-model="serviceform.rest_balance" :disabled="lock"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span class="lockWrapper" @click="lock = !lock">
          <d2-icon name="lock" v-if="lock"></d2-icon>
          <d2-icon name="unlock" v-if="!lock"></d2-icon>
        </span>
        <el-button @click="dialogDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogDetailVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 查看详情end -->

    <el-pagination
      center
      background
      layout="prev, pager, next"
      :total="total_count"
      :page-size="8"
      @current-change="getContractList"
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
      contractData: [],
      dialogFormVisible: false,
      dialogDetailVisible: false,
      formLabelWidth: "120px",
      editFlag: false,
      addFlag: false,
      form: {
        number: "",
        name: "",
        status: "",
        expire_time: "",
        content: "",
        remarks: "",
        partyA: "",
        partyB: ""
      },
      serviceform: {},
      total_count: 0,
      currentPage1: 1,
      page_size: "",
      itemkey: "",
      keywords: "",
      loading: true,
      contractList: [],
      lock: true
    };
  },
  methods: {
    async getService(id, page = 1) {
      try {
        const res = await this.$api.getList(
          "service",
          page,
          "contract_id=" + id
        );
        this.serviceform = res._list[0]
        console.log(this.serviceform)
      } catch(error) {
          console.log(error)
      }
    },
    // 加载可以添加的公司
    async loadCompany() {
      try {
        const res = await this.$api.getList("contract");
        for (let item of res._list) {
          this.contractList.push({
            id: +item.id,
            name: item.name
          });
        }
      } catch {}
    },
    async getContractList(page = 1) {
      try {
        this.loading = true;
        const res = await this.$api.getList("contract", page);
        console.log(res);
        if (res) this.loading = false;
        this.currentPage1 = page;
        this.contractData = res._list;
        this.total_count = +res.total_count;
      } catch (error) {
        console.log(error);
      }
    },
    async getOneContractList(id) {
      try {
        const res = await this.$api.getOneList("contract", id);
        this.form = res;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteContract(id) {
      try {
        console.log(id);
        const res = await this.$api.deleteList("contract", { cid: id }, id);
      } catch (error) {
        console.log(error);
      }
    },
    async editContract(id) {
      try {
        const res = await this.$api.editList("contract", this.getJSON(), id);
        if (res) {
          setTimeout(this.getContractList(1), 1000); // 调用接口重新渲染表格
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
    async addContract() {
      try {
        const res = await this.$api.addList("contract", this.getJSON());
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
          this.deleteContract(this.contractData[i].id);
          setTimeout(this.getContractList, 1000); // 调用接口重新渲染表格
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
    this.getContractList();
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

.el-dialog__footer {
  position: relative;
  i {
    position: absolute;
    left: 20px;
    bottom: 25px;
    cursor: pointer;
    font-size: 30px;
  }
}
</style>

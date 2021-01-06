<template>

  <div  class="mcontaner">

    <Header></Header>
    <div class="block">

      <el-timeline>

        <el-timeline-item :timestamp="blog.created" placement="top" v-for="blog in blogs">
          <el-card>
            <h4>
              <router-link :to="{name: 'BlogDetail', params: {blogId: blog.id}}">
                {{blog.title}}
              </router-link>
            </h4>
            <p>{{blog.description}}</p>

            <span class="mdelete" >

              <el-link type="primary" icon="el-icon-delete" @click="deleteBlog(blog.id)">删除</el-link>

            </span>

          </el-card>
        </el-timeline-item>

      </el-timeline>

      <el-pagination class="mpage"
                     background
                     layout="prev, pager, next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total"
                     @current-change=page>
      </el-pagination>

    </div>
    <Footer></Footer>

  </div>

</template>

<script>

  import Header from "../components/Header";
  import Footer from "../components/Footer";

  import picture from '@/assets/background.jpg'
  // import hasLogin from Header.data();

  export default {
    inject: ['reload'], // 引入方法
    name: "Blogs.vue",
    components: {Header},


    data() {
      return {
        backgroundImage: 'url(${picture})',
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5
      }
    },
    methods: {
      page(currentPage) {
        const _this = this
        _this.$axios.get("/blogs?currentPage=" + currentPage).then(res => {
          console.log(res)
          _this.blogs = res.data.data.records
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size

        })
      },
      deleteBlog(id) {
        //判断用户是否登录:无登录则跳转到登录页
        const token = this.$store.getters.getToken;
        if(token){
          //弹框提示
          this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //通过id删除指定文章
            this.$axios.delete("/deleteBlog/"+id).then(res=>{
              if(res.data.code===200){
                this.$message({type: 'success', message: '删除成功!'});
                //刷新页面并重新加载数据
                window.reload();
              }else {
                this.$message({type: 'error', message: '删除失败!'});
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else {
          this.$router.push("/login")
        }
      }
    },
    created() {
      this.page(1)
    }
  }


</script>

<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }
  .mdelete{
    position: absolute;
    left: 829px;
    width: 303px;
    top: 125px;
    padding: 0px;
  }
  .background{
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    position: absolute;
  }
  img {
    width: 100%;
    height: 100%;
  }
</style>
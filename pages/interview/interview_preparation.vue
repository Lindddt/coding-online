<template>
  <n-card
    title="创建新问题"
    class="bg-white w-11/12 items-center mx-auto p-4 rounded-md"
    content-style="width: 100%;"
  >
    <div class="left">
      <div v-for="i in data.interview_index">
        <h1 class="h1">
          {{ i }}
        </h1>

        <!--question_ID是输入题号 通过ID查找数据库将返回的信息装入 questions[i-1]中 前端没写该部分内容 需要完成 getQuestion(i) 函数-->
        <div
          v-if="data.man_machine_flags[i - 1] && !data.question_detail_flags[i - 1]"
          class="question_machine_data"
        >
          <div class="info">
            输入题目id:
          </div>
          <div class="machine_data_search">
            <input
              v-model="data.question_ID[i - 1]"
              type="text"
              class="number_message"
            >
            <button
              class="machine_data_define"
              @click="question_detail_change(i)"
            />
          </div>
          <span
            class="question_style_change"
            @click="question_style_change(i)"
          >手动输入题目</span>
        </div>


        <!--得到的 questions 的内容 最终会以该div显示出来-->
        <div
          v-if="data.question_detail_flags[i - 1]"
          class="problem_detail"
        >
          <ProblemDetail
            :title="data.questions[i - 1].title"
            :content="data.questions[i - 1].content"
            :inputformat="data.questions[i - 1].input_format"
            :inputExample="data.questions[i - 1].input_data"
            :outputExample="data.questions[i - 1].output_data"
            :remark="data.questions[i - 1].remark"
          />
        </div>
        <div style="overflow: auto">
          <i
            v-if="!data.mail_send_flag"
            class="icon-plus interview_plus_minus"
            @click="interview_plus()"
          />
          <i
            v-if="data.interview_index > 1 && !data.mail_send_flag"
            class="icon-minus interview_plus_minus"
            @click="interview_minus()"
          />
        </div>
      </div>

      <div class="right">
        <div
          v-show="!data.finish_question"
          class="invitation_code"
          :style="confirm_style()"
          :title="data.confirm_title"
          @click="confirm"
        >
          {{ data.confirm_content }}
        </div>
        <div
          v-show="data.finish_question"
          class="invitation_code"
          :style="confirm_style()"
          :title="data.confirm_title"
          @click="jump_interview"
        >
          进入面试
        </div>
        <div
          v-show="data.complete"
          class="post_content"
        >
          <div
            class="invitation_code"
            style="cursor: text; user-select: text"
          >
            {{ data.RID }}
          </div>
        </div>
        <div
          v-if="data.mail_send_flag"
          class="mail_send"
        >
          <input
            v-model="data.mail"
            type="text"
            class="mail_content"
            placeholder="面试者邮箱账号"
          >
          <button
            class="mail_send_confirm"
            @click="invitation_code_get()"
          >
            发送面试邀请
          </button>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang='ts'>
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent, reactive } from 'vue';
  import { navigateTo, definePageMeta, useRoute } from '#imports';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef, JSONSchema } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, MarkDownEditor, IODataEditor, ProblemDetail } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';

  const route = useRoute();
  definePageMeta({
    layout: 'nav',
    componentKey: 'interview_preparation'
  });
  const data = reactive({
    html: '',
    options: {
      markdownIt: {
        linkify: true
      }
    },

    man_machine_flags: [true],
    question_detail_flags: [false],
    output_table: 'output_input_table table_padding',
    input_table: 'output_input_table table_padding',
    interview_index: 1,
    invitation_code_content: '发送邀请码',
    input_variables: [1],
    input_label_visible: false,
    input_data_sets: [1],
    output_data_sets: [1],
    row_icon: 'icon-plus row_plus_sub',
    line_icon: 'icon-plus line_plus_sub',
    rl_plus_sub_flags: true,

    question_ID: [''],
    question_title: [''],
    question_format: [''],
    question_content: [''],
    question_variable: [['']],
    question_set_data: [[['']]],
    question_output_data: [['']],
    question_remark: [''],
    // 最终数据格式为 questions 每添加一道题目 questions长度+1 每一道题都有如下五种信息
    // title 字符串
    // input_format 字符串
    // input_data 数组 一组样例输入为一个字符串 形如 ['input_data = [1, 2, 3]', 'input_data = [2, 3, 4]']为两组输入样例
    // output_data 同上 一组样例输入为一个字符串
    // remark 字符串
    // content 题目描述
    questions: [{
      id: '',
      title: '',
      input_format: '',
      input_data: [],
      output_data: [''],
      remark: '',
      content: ''
    }],

    mail: '',
    question_confirm: false,
    confirm_content: '完成命题',
    confirm_title: '您尚未完成试题编写',
    mail_send_flag: false,// 是否能发送邮件
    complete: false,// 完成前置步骤，可以进入面试
    QIDs: [],
    RID: '',
    finish_question: false,
  });

  const questionList = ref([]);
  const add_new_question = async (i) => {
    // await axios({
    //   method: 'post',
    //   url: '/question/new_question',
    //   data: qs.stringify({
    //     title: data.questions[i].title,
    //     time: Date(),
    //     difficulty: 'Middle',
    //     content: data.questions[i].content,
    //     remark: data.questions[i].remark,
    //     inputFormat: data.questions[i].input_format,
    //     inputExample: data.questions[i].input_data.toString(),
    //     outputExample: data.questions[i].output_data.toString(),
    //   }),
    // })
    //   .then((res) => {
    //     // 获取数据
    //     if (res.data.errcode === 0) {
    //       if (res.data.result) console.log(res.data);
    //       // alert("complte");
    //       console.log(data.questions);
    //       console.log(i);
    //       data.questions[i].id = res.data.QID;
    //       console.log(data.questions);
    //       data.QIDs.push(res.data.QID);
    //     } else if (res.data.errcode === -1) {
    //       sendMessage.error('数据库连接失败');
    //     } else {
    //       sendMessage.error('数据库连接失败');
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  const check_new_problem = async () => {
    let len = data.questions.length;
    let i = 0;
    data.QIDs = [];
    for (; i < len; i++) {
      console.log(i);
      console.log(data.questions[i].id);
      if (data.questions[i].id.length !== 0) {
        data.QIDs.push(data.questions[i].id);
        console.log('dasdiaosdadasda');
        continue;
      } else {
        await add_new_question(i);
      }
    }
  };
  const invitation_code_get = async () => {
    if (data.mail === '') {
      sendMessage.error('面试者邮箱不能为空');
      return 0;
    } else {
      // await axios({
      //   method: 'post',
      //   url: '/check',
      //   data: qs.stringify({
      //     email: data.mail,
      //   }),
      // })
      //   .then(async (res) => {
      //     // 获取数据
      //     if (res.data.result === false) {
      //       sendMessage.error('找不到该名面试者');
      //     } else {
      //       sendMessage.success('与该名面试者取得连接');
      //       /*              sendMessage.success(data.email);
      //                     sendMessage.success(data.mail); */
      //       await check_new_problem();
      //       await new_room();
      //       console.log(data.QIDs.toString());
      //       data.mail_send_flag = false;
      //       data.confirm_content = '提交试卷';
      //       data.complete = true;
      //     }
      //   })
      //   .catch((error) => {
      //     sendMessage.error(error);
      //   });
    }

    // 首先获取到 mail 即为面试者账号 之后发送吧
    // 发送成功之后 将 mail_send_flag置为false 将confirm_content置为 提交试卷

    return 0;
  };
  const new_room = async () => {
    // await axios({
    //   method: 'post',
    //   url: '/room/new_room',
    //   data: qs.stringify(
    //     {
    //       interviewer: data.email,
    //       interviewee: data.mail,
    //       QIDs: data.QIDs,
    //     };
    //         { indices: false }
    // ),
    //     })
    //       .then((res) => {
    //   //获取数据
    //   if (res.data.errcode === 0) {
    //     data.RID = res.data.RID
    //   } else if (res.data.errcode === -1) {
    //     sendMessage.error('数据库连接失败')
    //   } else if (res.data.errcode === -2) {
    //     sendMessage.error('数据库操作失败')
    //   } else if (res.data.errcode === -3) {
    //     sendMessage.error('未指定面试者/面试官')
    //   } else if (res.data.errcode === -4) {
    //     sendMessage.error('与该面试者的房间已存在')
    //   } else if (res.data.errcode === -6) {
    //     sendMessage.error('未设置题目')
    //   }
    // })
    // .catch(function (error) {
    //   sendMessage.error(error)
    // })
  };
  const interview_plus = () => {
    data.interview_index += 1;
    data.input_data_sets.push(1);
    data.output_data_sets.push(1);
    data.input_variables.push(1);
    data.man_machine_flags.push(true);
    data.question_ID.push('');
    data.question_detail_flags.push(false);
    data.question_variable.push(['']);
    data.question_set_data.push([['']]);
    data.question_title.push('');
    data.question_format.push('');
    data.question_content.push('');
    data.question_output_data.push(['']);
    data.question_remark.push('');
    data.questions.push({
      title: '',
      input_format: '',
      input_data: [],
      output_data: [''],
      remark: '',
      content: '',
    });
  };
  const interview_minus = () => {
    data.interview_index -= 1;
    data.input_data_sets.pop();
    data.output_data_sets.pop();
    data.input_variables.pop();
    data.man_machine_flags.pop();
    data.question_ID.pop();
    data.question_detail_flags.pop();
    data.question_variable.pop();
    data.question_set_data.pop();
    data.question_title.pop();
    data.question_content.pop();
    data.question_format.pop();
    data.question_output_data.pop();
    data.question_remark.pop();
    data.questions.pop();
  };
  const input_table_mouse_over = () => {
    data.input_label_visible = true;
    data.input_table = 'output_input_table';
  };
  const input_table_mouse_leave = (i) => {
    data.input_label_visible = false;
    if (
      data.rl_plus_sub_flags ||
      (!data.rl_plus_sub_flags && data.input_data_sets[i - 1] > 1)
    ) {
      data.input_table = 'output_input_table table_padding';
    } else {
      data.input_table = 'output_input_table';
    }
  };
  const input_line_plus = (i) => {
    if (data.rl_plus_sub_flags) {
      data.input_variables[i - 1] = data.input_variables[i - 1] + 1;
      data.question_variable[i - 1].push('');
      for (let k = 0; k < data.input_data_sets[i - 1]; k++) {
        data.question_set_data[i - 1][k].push('');
      }
    } else {
      data.input_variables[i - 1] = data.input_variables[i - 1] - 1;
      data.question_variable[i - 1].pop();
      for (let k = 0; k < data.input_data_sets[i - 1]; k++) {
        data.question_set_data[i - 1][k].pop();
      }
    }
  };
  const input_row_plus = (i) => {
    if (data.rl_plus_sub_flags) {
      data.input_data_sets[i - 1] = data.input_data_sets[i - 1] + 1;
      data.question_set_data[i - 1].push([]);
      for (let k = 0; k < data.input_variables[i - 1]; k++) {
        data.question_set_data[i - 1][data.input_data_sets[i - 1] - 1].push(
          ''
        );
      }
    } else {
      data.input_data_sets[i - 1] = data.input_data_sets[i - 1] - 1;
      data.question_set_data[i - 1].pop();
    }
  };
  const output_plus = (i) => {
    data.output_data_sets[i - 1] = data.output_data_sets[i - 1] + 1;
    data.question_output_data[i - 1].push('');
  };
  const output_minus = (i) => {
    data.output_data_sets[i - 1] = data.output_data_sets[i - 1] - 1;
    data.question_output_data[i - 1].pop();
  };
  const icon_change = () => {
    if (data.rl_plus_sub_flags) {
      data.row_icon = 'icon-minus row_plus_sub';
      data.line_icon = 'icon-minus line_plus_sub';
      data.rl_plus_sub_flags = false;
    } else {
      data.row_icon = 'icon-plus row_plus_sub';
      data.line_icon = 'icon-plus line_plus_sub';
      data.rl_plus_sub_flags = true;
    }
  };
  const question_style_change = (i) => {
    if (data.man_machine_flags[i - 1]) {
      data.man_machine_flags[i - 1] = false;
    } else {
      data.man_machine_flags[i - 1] = true;
    }
  };
  const question_detail_change = (i) => {
    if (!data.question_detail_flags[i - 1]) {
      if (data.man_machine_flags[i - 1]) {
        console.log(getQuestion(i));
        if (getQuestion(i) === 1) {
          return 0;
        }
      } else {
        man_question_display(i);
      }
      data.question_detail_flags[i - 1] = true;
    } else {
      data.question_detail_flags[i - 1] = false;
    }
  };
  const get = async (i) => {
    let id = data.question_ID[i - 1];
    console.log(id);
    const res = await models.getProblemDetail({ id });
    questionList.value.push(res);
    return 1;
  };
  const man_question_display = (i) => {
    for (let k = 0; k < i; k++) {
      data.questions[i - 1] = {
        title: '',
        input_format: '',
        input_data: [],
        output_data: [''],
        remark: '',
      };
    }
    for (let j = 0; j < data.input_data_sets[i - 1]; j++) {
      data.questions[i - 1].input_data.push('');
      for (let k = 0; k < data.input_variables[i - 1]; k++) {
        if (data.question_variable[i - 1][k] !== '') {
          data.questions[i - 1].input_data[j] =
            data.questions[i - 1].input_data[j] +
            data.question_variable[i - 1][k] +
            ' = ' +
            data.question_set_data[i - 1][j][k] +
            ' ';
        } else {
          data.questions[i - 1].input_data[j] =
            data.questions[i - 1].input_data[j] +
            data.question_set_data[i - 1][j][k] +
            ' ';
        }
      }
    }

    for (let k = 0; k < data.output_data_sets[i - 1]; k++) {
      data.questions[i - 1].output_data[k] =
        data.question_output_data[i - 1][k] + ' ';
    }

    data.questions[i - 1].title = data.question_title[i - 1];
    data.questions[i - 1].content = data.question_content[i - 1];
    data.questions[i - 1].input_format = data.question_format[i - 1];
    data.questions[i - 1].remark = data.question_remark[i - 1];
    data.questions[i - 1].id = data.question_ID[i - 1];
  };
  const confirm_style = () => {
    for (let i = 0; i < data.question_detail_flags.length; i++) {
      if (!data.question_detail_flags[i]) {
        data.confirm_title = '您尚未完成试题编写';
        return {
          backgroundColor: 'rgba(196,196,196,1)',
          cursor: 'default',
        };
      }
    }
    data.confirm_title = '';
    return {
      cursor: 'pointer',
      backgroundColor: 'rgba(46,181,61,1)',
    };
  };
  const confirm = () => {
    for (let i = 0; i < data.question_detail_flags.length; i++) {
      if (!data.question_detail_flags[i]) {
        return 0;
      }
    }
    if (data.complete) {
      let input = document.createElement('input'); // js创建一个input输入框
      input.value = data.RID; // 将需要复制的文本赋值到创建的input输入框中，data.ruleForm.url这个是我要复制的内容
      document.body.appendChild(input); // 将输入框暂时创建到实例里面
      input.select(); // 选中输入框中的内容
      document.execCommand('Copy'); // 执行复制操作
      alert('题目完成，请邀请面试人进入面试');
      data.finish_question = true;
    } else if (!data.question_confirm) {
      data.question_confirm = true;
      data.confirm_content = '继续命题';
      data.mail_send_flag = true;
    } else {
      data.question_confirm = false;
      data.confirm_content = '完成命题';
      data.mail_send_flag = false;
    }
  };
  const jump_interview = async () => {
    // this.$router.push({ path: '/interviewer_room', query: { RID: data.RID } })
    await navigateTo({
      path: '/problems/problem_detail',
      query: {
        room_id: data.RID,
      }
    });
  };

</script>
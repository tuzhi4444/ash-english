// Phase 2 · 阻抗突围：4-5 句，过去时 / 从句 / 进行时，成年人的日常交流场景
import { p } from './builder';
import type { Passage } from '../../types';

export const PHASE2: Passage[] = [
  // ---------- 求职与职场 ----------
  p(2, 'p2_interview', '面试', [
    ['I had an interview at a small company yesterday.', '昨天我在一家小公司面试。'],
    ['The manager asked me why I wanted the job.', '经理问我为什么想要这份工作。'],
    ['I told her about my last project.', '我跟她讲了我上一个项目。'],
    ['She said they would call me this week.', '她说这周会给我打电话。'],
  ], [
    ['经理问了什么？', ['为什么想要这份工作', '期望薪水', '什么时候能上班', '为什么离职']],
    ['他回答时讲了什么？', ['上一个项目', '他的学校', '他的爱好', '他的家庭']],
    ['结果如何？', ['公司这周会联系他', '当场录用', '被拒绝了', '要再面一轮']],
  ]),

  p(2, 'p2_first_day', '第一天上班', [
    ['On my first day, I arrived half an hour early.', '第一天我提前半小时到。'],
    ['A woman at the door showed me my desk.', '门口一位女士带我去我的工位。'],
    ['Everyone was busy, so I read the documents alone.', '大家都很忙，所以我自己看文件。'],
    ['At noon two people invited me to lunch.', '中午有两个人叫我一起吃午饭。'],
  ], [
    ['他提前多久到的？', ['半小时', '一小时', '十分钟', '刚好准时']],
    ['上午他做了什么？', ['自己看文件', '开会', '和同事聊天', '参观公司']],
    ['中午发生了什么？', ['有人叫他吃午饭', '他一个人吃', '他回家了', '他没吃']],
  ]),

  p(2, 'p2_meeting', '开会', [
    ['We had a long meeting this morning.', '今天上午我们开了个长会。'],
    ['My boss was explaining the new plan.', '老板在讲新计划。'],
    ['Nobody asked any questions.', '没人提问。'],
    ['I think most people did not understand it.', '我觉得大部分人没听懂。'],
  ], [
    ['老板在讲什么？', ['新计划', '上季度业绩', '人事变动', '客户投诉']],
    ['会上有人提问吗？', ['没有', '有很多', '只有他', '只有一个人']],
    ['他怎么看？', ['大部分人没听懂', '大家都懂了', '计划很好', '会开得太短']],
  ]),

  p(2, 'p2_overtime', '加班', [
    ['I worked until nine last night.', '昨晚我工作到九点。'],
    ['The report was due this morning.', '报告今天早上就要交。'],
    ['My wife kept my dinner warm.', '我妻子给我留了热饭。'],
    ['I was too tired to eat it.', '我累得吃不下。'],
  ], [
    ['他昨晚工作到几点？', ['九点', '八点', '十点', '半夜']],
    ['为什么加班？', ['报告今早要交', '老板要求', '事情太多', '同事请假']],
    ['回家后他吃饭了吗？', ['太累没吃', '吃完了', '只吃了一点', '出去吃了']],
  ]),

  p(2, 'p2_day_off', '请假', [
    ['Could I take tomorrow off?', '我明天能请一天假吗？'],
    ['Is something wrong?', '有什么事吗？'],
    ['My son is going to the hospital for a check.', '我儿子要去医院检查。'],
    ['Of course. Family comes first.', '当然可以。家人第一。'],
  ], [
    ['他为什么请假？', ['儿子要去医院检查', '自己生病', '家里有客人', '要出差']],
    ['老板的态度是？', ['同意，家人第一', '不同意', '让他调休', '让他考虑清楚']],
  ]),

  p(2, 'p2_colleague', '同事', [
    ['A new colleague joined our team last month.', '上个月一位新同事加入我们组。'],
    ['She used to work in another city.', '她以前在另一个城市工作。'],
    ['She learns everything very fast.', '她学什么都很快。'],
    ['We often have coffee together in the morning.', '我们常常早上一起喝咖啡。'],
  ], [
    ['新同事以前在哪里工作？', ['另一个城市', '同一家公司', '国外', '学校']],
    ['她有什么特点？', ['学得很快', '很安静', '经验丰富', '很爱说话']],
  ]),

  p(2, 'p2_boss', '被表扬', [
    ['My boss called me into his office.', '老板叫我进他办公室。'],
    ['At first I thought I had made a mistake.', '一开始我以为我做错了什么。'],
    ['But he wanted to thank me for the work.', '但他是想为那份工作感谢我。'],
    ['I felt relaxed when I walked out.', '走出来时我松了口气。'],
  ], [
    ['他一开始以为发生了什么？', ['自己做错了事', '要被辞退', '要加薪', '要出差']],
    ['实际上老板要做什么？', ['感谢他的工作', '批评他', '给他新任务', '问他意见']],
  ]),

  // ---------- 餐饮 ----------
  p(2, 'p2_restaurant', '餐厅点餐', [
    ['Are you ready to order?', '您可以点餐了吗？'],
    ['Yes, I will have the fish and a glass of water.', '好的，我要鱼和一杯水。'],
    ['Would you like anything else?', '还需要别的吗？'],
    ['No, thank you. That is all.', '不用了，谢谢，就这些。'],
  ], [
    ['他点了什么？', ['鱼和一杯水', '牛肉和茶', '面条', '汤和面包']],
    ['他还要别的吗？', ['不要了', '要甜点', '要咖啡', '再想想']],
  ]),

  p(2, 'p2_delivery_food', '点外卖', [
    ['We ordered food on the phone last night.', '昨晚我们用手机点了外卖。'],
    ['They said it would arrive in thirty minutes.', '他们说三十分钟送到。'],
    ['It came after an hour and it was cold.', '一小时后才到，而且是凉的。'],
    ['We will not order from that place again.', '我们不会再从那家点了。'],
  ], [
    ['商家说多久送到？', ['三十分钟', '一小时', '二十分钟', '没说']],
    ['实际情况怎么样？', ['一小时才到还是凉的', '准时送到', '送错了', '没送到']],
    ['他们的决定是？', ['不再从那家点', '投诉商家', '要求退款', '下次早点点']],
  ]),

  p(2, 'p2_coffee_shop', '咖啡店', [
    ['The coffee shop near my office is always full.', '我办公室附近的咖啡店总是满的。'],
    ['I go there when I need to think.', '我需要思考时会去那里。'],
    ['The noise does not bother me.', '嘈杂声不影响我。'],
    ['Somehow I work better there than at home.', '不知为什么我在那里比在家工作得好。'],
  ], [
    ['他什么时候去咖啡店？', ['需要思考时', '每天早上', '午休时', '下班后']],
    ['嘈杂声对他有影响吗？', ['没有影响', '很烦人', '让他分心', '他戴耳机']],
  ]),

  p(2, 'p2_cook', '学做饭', [
    ['My friend was teaching me to cook last Sunday.', '上周日我朋友在教我做饭。'],
    ['She said the fire was too big.', '她说火太大了。'],
    ['The vegetables turned black in a minute.', '菜一分钟就黑了。'],
    ['We laughed and ordered noodles instead.', '我们笑了笑，改点了面条。'],
  ], [
    ['朋友指出了什么问题？', ['火太大', '油太多', '菜没洗', '锅太小']],
    ['最后他们吃了什么？', ['点的面条', '烧黑的菜', '出去吃', '没吃']],
  ]),

  p(2, 'p2_dinner_guest', '请客', [
    ['We invited our neighbors to dinner on Saturday.', '周六我们请邻居来吃饭。'],
    ['My husband cooked all afternoon.', '我丈夫做了一下午饭。'],
    ['They brought a bottle of wine and some fruit.', '他们带来一瓶酒和一些水果。'],
    ['We talked until midnight.', '我们聊到半夜。'],
  ], [
    ['谁做的饭？', ['她丈夫', '她自己', '邻居', '一起做的']],
    ['邻居带了什么？', ['一瓶酒和水果', '蛋糕', '花', '什么都没带']],
    ['他们聊到什么时候？', ['半夜', '十点', '天亮', '晚饭后就散了']],
  ]),

  // ---------- 购物 ----------
  p(2, 'p2_return', '退货', [
    ['I bought these shoes last week.', '这双鞋我上周买的。'],
    ['They are too small for me.', '对我来说太小了。'],
    ['Do you have the receipt?', '您有小票吗？'],
    ['Yes, here it is.', '有，在这里。'],
  ], [
    ['鞋子有什么问题？', ['太小了', '太大了', '颜色不对', '坏了']],
    ['店员要求什么？', ['小票', '身份证', '包装盒', '付款记录']],
  ]),

  p(2, 'p2_online_shop', '网购', [
    ['She spends too much money online.', '她网购花太多钱。'],
    ['Last month she bought three coats.', '上个月她买了三件外套。'],
    ['Two of them are still in the box.', '其中两件还在盒子里。'],
    ['She says she will stop, but nobody believes her.', '她说会停手，但没人信。'],
  ], [
    ['她上个月买了什么？', ['三件外套', '两双鞋', '一个包', '很多书']],
    ['其中几件还没拆？', ['两件', '一件', '三件都没拆', '都拆了']],
  ]),

  p(2, 'p2_package', '快递', [
    ['My package did not arrive yesterday.', '我的快递昨天没到。'],
    ['I called the company this morning.', '今天早上我打电话给公司。'],
    ['They said the driver went to the wrong street.', '他们说司机走错街了。'],
    ['It will come again this afternoon.', '今天下午会再送。'],
  ], [
    ['快递为什么没到？', ['司机走错街了', '地址写错了', '天气原因', '没人签收']],
    ['什么时候会再送？', ['今天下午', '明天', '今晚', '下周']],
  ]),

  p(2, 'p2_bargain', '讲价', [
    ['This bag looks nice. How much?', '这个包不错，多少钱？'],
    ['Two hundred, but I can give it to you for one eighty.', '两百，不过可以给你一百八。'],
    ['Can you make it one fifty?', '一百五行吗？'],
    ['All right, because you are my first customer today.', '好吧，因为你是我今天第一个客人。'],
  ], [
    ['最后成交多少钱？', ['一百五', '一百八', '两百', '没谈成']],
    ['老板为什么同意？', ['他是今天第一个客人', '包有瑕疵', '快关门了', '他是熟客']],
  ]),

  // ---------- 出行 ----------
  p(2, 'p2_rain', '没带伞', [
    ['It started to rain when I left the office.', '我离开办公室的时候开始下雨了。'],
    ['I did not bring my umbrella that day.', '那天我没带伞。'],
    ['I ran to the bus stop as fast as I could.', '我用最快的速度跑到公交站。'],
    ['My clothes were all wet when I got on the bus.', '上车的时候我衣服全湿了。'],
  ], [
    ['什么时候开始下雨的？', ['他离开办公室时', '早上', '半夜', '他到家后']],
    ['他为什么淋湿了？', ['没带伞', '伞坏了', '雨太大', '走得太慢']],
  ]),

  p(2, 'p2_taxi', '打车', [
    ['Could you take me to the train station?', '能送我去火车站吗？'],
    ['Sure. Are you in a hurry?', '好的。您赶时间吗？'],
    ['My train leaves in forty minutes.', '我的火车四十分钟后开。'],
    ['Do not worry, we have enough time.', '别担心，时间够。'],
  ], [
    ['他要去哪里？', ['火车站', '机场', '公司', '医院']],
    ['他的火车多久后开？', ['四十分钟后', '二十分钟后', '一小时后', '半小时后']],
  ]),

  p(2, 'p2_traffic', '堵车', [
    ['We were driving to the airport this morning.', '今天早上我们开车去机场。'],
    ['The traffic did not move for twenty minutes.', '车堵着二十分钟没动。'],
    ['My friend was getting nervous.', '我朋友越来越紧张。'],
    ['In the end we caught the plane.', '最后我们还是赶上了飞机。'],
  ], [
    ['车堵了多久没动？', ['二十分钟', '十分钟', '一小时', '半小时']],
    ['结果怎么样？', ['赶上了飞机', '错过了飞机', '改签了', '取消了行程']],
  ]),

  p(2, 'p2_subway', '地铁', [
    ['The subway is crowded at eight in the morning.', '早上八点地铁很挤。'],
    ['People stand very close to each other.', '人们挨得很近。'],
    ['I usually listen to music and close my eyes.', '我通常听着音乐闭上眼。'],
    ['Twenty minutes later I am at work.', '二十分钟后我就到公司了。'],
  ], [
    ['地铁什么时候最挤？', ['早上八点', '下午六点', '中午', '晚上']],
    ['他在地铁上做什么？', ['听音乐闭眼', '看手机', '看书', '睡觉']],
  ]),

  p(2, 'p2_train_station', '火车站', [
    ['There were hundreds of people at the station.', '车站有几百人。'],
    ['A voice told us the train was thirty minutes late.', '广播说火车晚点三十分钟。'],
    ['An old man asked me to help him find his seat number.', '一位老人请我帮他找座位号。'],
    ['He thanked me three times before I left.', '我走之前他谢了我三次。'],
  ], [
    ['火车怎么了？', ['晚点三十分钟', '取消了', '提前了', '换站台了']],
    ['老人请他帮什么忙？', ['找座位号', '拿行李', '买票', '打电话']],
  ]),

  p(2, 'p2_hotel', '订酒店', [
    ['I would like a room for two nights.', '我想订两晚的房间。'],
    ['Do you want a room with a window?', '要有窗户的房间吗？'],
    ['Yes, and a quiet one if possible.', '要，如果可以的话要安静的。'],
    ['We have one on the top floor.', '我们顶层有一间。'],
  ], [
    ['他要住几晚？', ['两晚', '一晚', '三晚', '一周']],
    ['最后给他的房间在哪里？', ['顶层', '一楼', '中间层', '后院']],
  ]),

  p(2, 'p2_beach', '海边', [
    ['Last summer we spent a week by the sea.', '去年夏天我们在海边待了一周。'],
    ['The children were playing in the sand all day.', '孩子们整天在沙滩上玩。'],
    ['My wife read three books in that week.', '我妻子那周读了三本书。'],
    ['Nobody wanted to go home.', '没人想回家。'],
  ], [
    ['他们在海边待了多久？', ['一周', '三天', '两周', '一个月']],
    ['妻子那周做了什么？', ['读了三本书', '游泳', '拍照', '睡觉']],
  ]),

  p(2, 'p2_photo', '拍照', [
    ['We took many photos on the mountain.', '我们在山上拍了很多照片。'],
    ['My phone died before we reached the top.', '还没到山顶我手机就没电了。'],
    ['Luckily my brother took some for me.', '幸好我哥帮我拍了几张。'],
    ['He sent them to me that evening.', '那天晚上他发给了我。'],
  ], [
    ['他手机怎么了？', ['没到山顶就没电了', '摔坏了', '丢了', '进水了']],
    ['最后照片怎么来的？', ['哥哥帮他拍并发给他', '别人帮拍的', '没拍到', '用相机拍的']],
  ]),

  p(2, 'p2_dialog_plan', '对话：周末计划', [
    ['What are you doing this Saturday?', '这周六你要做什么？'],
    ["I'm planning to visit my grandmother.", '我打算去看我奶奶。'],
    ['That sounds nice. Where does she live?', '听起来不错。她住在哪里？'],
    ['She lives in a small village near the river.', '她住在河边的一个小村子里。'],
  ], [
    ['他周六打算做什么？', ['去看奶奶', '去上班', '在家休息', '去旅行']],
    ['奶奶住在哪里？', ['河边的小村子', '城市里', '山上', '海边']],
  ]),

  p(2, 'p2_weekend', '上周末', [
    ['Last weekend I went to the mountain with my friends.', '上周末我和朋友们去了山里。'],
    ['The weather was sunny and warm.', '天气晴朗又温暖。'],
    ['We took many photos there.', '我们在那里拍了很多照片。'],
    ['We came back home in the evening.', '我们傍晚回到家。'],
    ['I was tired but very happy.', '我很累但是很开心。'],
  ], [
    ['他上周末去了哪里？', ['山里', '海边', '公园', '城市']],
    ['他们在那里做了什么？', ['拍了很多照片', '游泳', '买东西', '吃饭']],
    ['他回家后感觉怎么样？', ['累但开心', '很生气', '很难过', '很饿']],
  ]),

  // ---------- 健康 ----------
  p(2, 'p2_doctor', '看医生', [
    ['I have had a headache for three days.', '我头疼三天了。'],
    ['Do you sleep well at night?', '晚上睡得好吗？'],
    ['Not really. I work until very late.', '不太好，我工作到很晚。'],
    ['Then rest more and drink more water.', '那就多休息、多喝水。'],
  ], [
    ['他哪里不舒服？', ['头疼', '肚子疼', '嗓子疼', '发烧']],
    ['医生认为原因可能是什么？', ['睡得不好、工作太晚', '感冒', '吃坏了', '压力大']],
    ['医生的建议是？', ['多休息多喝水', '吃药', '去医院检查', '换工作']],
  ]),

  p(2, 'p2_pharmacy', '药店', [
    ['Do you have anything for a cough?', '有治咳嗽的药吗？'],
    ['How long have you been coughing?', '您咳多久了？'],
    ['About a week.', '大概一周。'],
    ['If it does not stop, please see a doctor.', '如果不见好，请去看医生。'],
  ], [
    ['他咳了多久？', ['大概一周', '三天', '一个月', '两天']],
    ['店员提醒了什么？', ['不见好要看医生', '按时吃药', '多喝水', '不要吃冷的']],
  ]),

  p(2, 'p2_gym', '健身房', [
    ['I joined a gym near my house in March.', '三月我在家附近办了张健身卡。'],
    ['At the beginning I went four times a week.', '一开始我一周去四次。'],
    ['Now I go once a month.', '现在一个月去一次。'],
    ['The card cost me a lot of money.', '这张卡花了我不少钱。'],
  ], [
    ['一开始他一周去几次？', ['四次', '三次', '两次', '每天']],
    ['现在呢？', ['一个月一次', '一周一次', '完全不去', '还是四次']],
  ]),

  p(2, 'p2_running', '跑步', [
    ['My neighbor runs by the river every morning.', '我邻居每天早上沿河跑步。'],
    ['He is over sixty but very strong.', '他六十多了但很硬朗。'],
    ['He told me he started thirty years ago.', '他说他三十年前开始跑的。'],
    ['I want to try, but I always find an excuse.', '我想试试，但总能找到借口。'],
  ], [
    ['邻居多大年纪？', ['六十多', '五十多', '七十多', '四十多']],
    ['他跑了多久了？', ['三十年', '十年', '二十年', '三年']],
    ['说话人自己呢？', ['想跑但总找借口', '也跟着跑', '不感兴趣', '刚开始跑']],
  ]),

  p(2, 'p2_hurt', '受伤', [
    ['I fell down while I was playing football.', '我踢球时摔倒了。'],
    ['My knee hurt a lot that night.', '那天晚上我膝盖很疼。'],
    ['The doctor said nothing was broken.', '医生说没骨折。'],
    ['I had to rest for two weeks.', '我不得不休息两周。'],
  ], [
    ['他怎么受伤的？', ['踢球时摔倒', '跑步时', '骑车摔的', '走路滑倒']],
    ['医生怎么说？', ['没骨折', '需要手术', '要打石膏', '很严重']],
  ]),

  // ---------- 居住 ----------
  p(2, 'p2_rent', '租房', [
    ['I am looking for a flat near the subway.', '我在找地铁附近的公寓。'],
    ['How much can you pay each month?', '您每月能付多少？'],
    ['Under three thousand, if possible.', '如果可以的话三千以内。'],
    ['I have two rooms to show you tomorrow.', '我明天可以带您看两间。'],
  ], [
    ['他想租在哪里？', ['地铁附近', '公司附近', '市中心', '学校附近']],
    ['他的预算是？', ['三千以内', '两千以内', '四千以内', '没说']],
  ]),

  p(2, 'p2_landlord', '房东', [
    ['The water in my bathroom stopped this morning.', '今天早上我卫生间没水了。'],
    ['I sent a message to my landlord.', '我给房东发了消息。'],
    ['He answered after four hours.', '他四小时后才回。'],
    ['A worker is coming tomorrow morning.', '明天早上有工人来。'],
  ], [
    ['出了什么问题？', ['卫生间没水', '没电', '门坏了', '窗户漏风']],
    ['房东多久回复的？', ['四小时后', '马上', '第二天', '一直没回']],
  ]),

  p(2, 'p2_internet', '装网络', [
    ['The worker came to install the internet at ten.', '工人十点来装网络。'],
    ['He worked for two hours in the small room.', '他在小房间里干了两个小时。'],
    ['Everything was fine when he left.', '他走的时候一切正常。'],
    ['But at night the internet stopped again.', '但晚上网络又断了。'],
  ], [
    ['工人干了多久？', ['两个小时', '一个小时', '一上午', '半小时']],
    ['晚上发生了什么？', ['网络又断了', '一切正常', '工人又来了', '停电了']],
  ]),

  p(2, 'p2_move', '搬家', [
    ['We moved to a new flat last month.', '上个月我们搬到新公寓。'],
    ['Three friends came to help us.', '三个朋友来帮忙。'],
    ['The heaviest thing was the old piano.', '最重的是那架旧钢琴。'],
    ['We gave them dinner and a lot of thanks.', '我们请他们吃了饭，谢了又谢。'],
  ], [
    ['几个朋友来帮忙？', ['三个', '两个', '四个', '一个']],
    ['最重的东西是什么？', ['旧钢琴', '床', '书柜', '冰箱']],
  ]),

  p(2, 'p2_neighbor', '邻居', [
    ['Our neighbor plays music late at night.', '我们邻居半夜放音乐。'],
    ['My wife could not sleep for a week.', '我妻子一周都睡不好。'],
    ['I finally knocked on his door and talked to him.', '我最后敲了他的门跟他谈。'],
    ['He was very sorry and it has been quiet since then.', '他很抱歉，从那以后就安静了。'],
  ], [
    ['邻居做了什么？', ['半夜放音乐', '养狗吵闹', '装修', '开派对']],
    ['他怎么解决的？', ['敲门当面谈', '报警', '写纸条', '忍着']],
    ['结果如何？', ['从那以后安静了', '邻居不理他', '吵起来了', '他搬走了']],
  ]),

  // ---------- 金钱 ----------
  p(2, 'p2_bank', '银行开户', [
    ['I would like to open an account.', '我想开个户。'],
    ['Please fill in this form and show me your card.', '请填这张表并出示您的证件。'],
    ['How long will it take?', '要多久？'],
    ['About fifteen minutes.', '大概十五分钟。'],
  ], [
    ['他要办什么？', ['开户', '取钱', '换钱', '办卡']],
    ['要多久？', ['大概十五分钟', '半小时', '五分钟', '一小时']],
  ]),

  p(2, 'p2_atm', '取钱', [
    ['The machine ate my card last night.', '昨晚机器把我的卡吞了。'],
    ['I waited outside the bank until it opened.', '我在银行外等到开门。'],
    ['The woman inside got it back in a minute.', '里面的女士一分钟就取回来了。'],
    ['I felt silly for worrying all night.', '我为担心了一整夜感到好笑。'],
  ], [
    ['发生了什么？', ['机器吞了他的卡', '卡丢了', '取不出钱', '密码错了']],
    ['问题解决得怎么样？', ['一分钟就取回来了', '花了很久', '卡作废了', '要补办']],
  ]),

  p(2, 'p2_bill', '账单', [
    ['My phone bill was much higher this month.', '我这个月话费高了很多。'],
    ['I called them and asked why.', '我打电话问为什么。'],
    ['They said I used the internet abroad.', '他们说我在国外用了流量。'],
    ['I had forgotten to turn it off on my trip.', '我旅行时忘了关。'],
  ], [
    ['账单怎么了？', ['比平时高很多', '没收到', '算错了', '重复扣费']],
    ['原因是什么？', ['旅行时忘关国外流量', '换了套餐', '打电话太多', '系统错误']],
  ]),

  p(2, 'p2_lend', '借钱给朋友', [
    ['A friend asked me for money last year.', '去年一个朋友向我借钱。'],
    ['I lent him two thousand without asking why.', '我没问原因就借了他两千。'],
    ['He paid me back three months later.', '三个月后他还了我。'],
    ['He also brought a box of tea to say thanks.', '他还带了一盒茶来道谢。'],
  ], [
    ['他借了多少？', ['两千', '一千', '三千', '五千']],
    ['朋友多久还的？', ['三个月后', '一个月后', '半年后', '一年后']],
  ]),

  // ---------- 娱乐与生活 ----------
  p(2, 'p2_movie', '看电影', [
    ['We went to see a film on Friday night.', '周五晚上我们去看了场电影。'],
    ['The story was slow at the beginning.', '故事开头很慢。'],
    ['But the last twenty minutes were wonderful.', '但最后二十分钟精彩极了。'],
    ['My friend even cried a little.', '我朋友还哭了一点。'],
  ], [
    ['电影开头怎么样？', ['很慢', '很精彩', '看不懂', '很吵']],
    ['朋友的反应是？', ['哭了一点', '睡着了', '中途走了', '不喜欢']],
  ]),

  p(2, 'p2_concert', '演唱会', [
    ['The tickets sold out in five minutes.', '票五分钟就卖光了。'],
    ['My sister was lucky and got two.', '我妹妹运气好抢到了两张。'],
    ['We stood for three hours and sang every song.', '我们站了三小时，每首歌都跟着唱。'],
    ['My voice was gone the next day.', '第二天我嗓子哑了。'],
  ], [
    ['票多久卖光的？', ['五分钟', '一小时', '一天', '十分钟']],
    ['第二天他怎么了？', ['嗓子哑了', '腿疼', '感冒了', '很困']],
  ]),

  p(2, 'p2_game', '打游戏', [
    ['My son plays that game every evening.', '我儿子每晚都玩那个游戏。'],
    ['He was playing when I came home yesterday.', '昨天我回家时他正在玩。'],
    ['I asked him to stop after one hour.', '我让他一小时后停。'],
    ['He agreed, but he did not.', '他答应了，但没做到。'],
  ], [
    ['他要求儿子怎么做？', ['一小时后停', '不许玩', '做完作业再玩', '只能周末玩']],
    ['儿子做到了吗？', ['答应了但没做到', '做到了', '不同意', '关机了']],
  ]),

  p(2, 'p2_series', '追剧', [
    ['My wife and I started a new series last week.', '上周我和妻子开始追一部新剧。'],
    ['We said we would watch one part each night.', '我们说好每晚看一集。'],
    ['On the first night we watched five.', '第一晚我们看了五集。'],
    ['We went to bed at two in the morning.', '我们凌晨两点才睡。'],
  ], [
    ['他们说好每晚看几集？', ['一集', '两集', '三集', '看到困为止']],
    ['第一晚实际看了几集？', ['五集', '一集', '三集', '两集']],
  ]),

  p(2, 'p2_library', '图书馆', [
    ['The library on the third floor is very quiet.', '三楼的图书馆很安静。'],
    ['Students are reading there from morning to night.', '学生们从早到晚在那里看书。'],
    ['You must turn off your phone before you enter.', '进去之前必须关手机。'],
    ['I go there when I need to finish something.', '我需要完成什么事时就去那里。'],
  ], [
    ['图书馆在几楼？', ['三楼', '二楼', '一楼', '四楼']],
    ['进去之前要做什么？', ['关手机', '登记', '存包', '换鞋']],
  ]),

  p(2, 'p2_exam', '考试', [
    ['I took an English exam last Friday.', '上周五我考了英语。'],
    ['The listening part was much harder than I thought.', '听力部分比我想的难得多。'],
    ['I could not catch the last question at all.', '最后一题我完全没听清。'],
    ['I will practice listening every day from now on.', '从现在起我要每天练听力。'],
  ], [
    ['哪部分最难？', ['听力', '阅读', '写作', '口语']],
    ['他的打算是？', ['每天练听力', '再考一次', '报班', '放弃']],
  ]),

  p(2, 'p2_class_sign', '报名课程', [
    ['I want to sign up for the cooking class.', '我想报名烹饪课。'],
    ['It starts next Monday evening.', '下周一晚上开课。'],
    ['Is there any room left?', '还有位置吗？'],
    ['Only two, so you should decide today.', '只剩两个，所以您今天得决定。'],
  ], [
    ['课什么时候开始？', ['下周一晚上', '下周六', '明天', '下个月']],
    ['还剩几个位置？', ['两个', '一个', '很多', '没有了']],
  ]),

  p(2, 'p2_birthday_party', '生日聚会', [
    ['We were preparing the room when she arrived.', '她到的时候我们正在布置房间。'],
    ['She did not know anything about the party.', '她完全不知道有派对。'],
    ['Her face was so funny when we turned on the light.', '我们开灯时她的表情太好笑了。'],
    ['She said it was her best birthday.', '她说这是她最好的生日。'],
  ], [
    ['她知道有派对吗？', ['完全不知道', '早就知道', '猜到了', '朋友告诉她了']],
    ['她怎么评价？', ['最好的生日', '太吵了', '没准备好', '很意外']],
  ]),

  p(2, 'p2_gift', '送礼物', [
    ['What should I buy for my mother?', '我该给妈妈买什么？'],
    ['She likes flowers, but they die so fast.', '她喜欢花，但花谢得太快。'],
    ['Why not buy her a plant instead?', '那为什么不买盆植物？'],
    ['That is a good idea. Thank you.', '好主意，谢谢。'],
  ], [
    ['为什么不买花？', ['花谢得太快', '妈妈不喜欢', '太贵', '买不到']],
    ['最后决定买什么？', ['一盆植物', '一束花', '衣服', '还没决定']],
  ]),

  p(2, 'p2_goodbye', '告别', [
    ['My colleague is leaving for another city.', '我同事要去另一个城市了。'],
    ['We had dinner together last night.', '昨晚我们一起吃了饭。'],
    ['Everyone said they would visit her.', '大家都说会去看她。'],
    ['I wonder how many of us really will.', '我想知道我们当中有几个真会去。'],
  ], [
    ['同事要去哪里？', ['另一个城市', '国外', '回老家', '别的公司']],
    ['说话人的想法是？', ['怀疑有几个人真会去', '很期待去看她', '很难过', '无所谓']],
  ]),

  p(2, 'p2_phone_dead', '手机没电', [
    ['My phone died while I was waiting for my friend.', '等朋友的时候我手机没电了。'],
    ['I could not call her or check the time.', '我没法打电话也看不了时间。'],
    ['I sat on a bench and watched the street.', '我坐在长椅上看街景。'],
    ['It was the quietest hour of my whole week.', '那是我整周最安静的一小时。'],
  ], [
    ['手机没电后他做了什么？', ['坐长椅上看街景', '找地方充电', '回家了', '借电话']],
    ['他怎么评价那段时间？', ['整周最安静的一小时', '很焦虑', '浪费时间', '很生气']],
  ]),

  p(2, 'p2_umbrella_lost', '丢伞', [
    ['I have lost four umbrellas this year.', '今年我已经丢了四把伞。'],
    ['I always leave them in taxis or shops.', '我总是把它们落在出租车或店里。'],
    ['Now I buy the cheapest ones.', '现在我只买最便宜的。'],
    ['My wife thinks I should just get wet.', '我妻子觉得我干脆淋雨算了。'],
  ], [
    ['今年丢了几把伞？', ['四把', '三把', '两把', '五把']],
    ['他现在怎么做？', ['只买最便宜的', '不带伞了', '买很多把', '用别人的']],
  ]),
];

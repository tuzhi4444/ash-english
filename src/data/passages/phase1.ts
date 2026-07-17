// Phase 1 · 冷启动：3-4 句，一般现在时/过去时为主，日常最基础的场景
// 主语与句式刻意轮换（I / She / We / They / There is / 疑问 / 祈使 / 对话），避免通篇“I ...”
import { p } from './builder';
import type { Passage } from '../../types';

export const PHASE1: Passage[] = [
  // ---------- 起居 ----------
  p(1, 'p1_morning', '早晨', [
    ['I get up at seven every morning.', '我每天早上七点起床。'],
    ['I wash my face and eat breakfast.', '我洗脸然后吃早饭。'],
    ['Then I go to school by bus.', '然后我坐公交车去学校。'],
  ], [
    ['他每天几点起床？', ['七点', '六点', '八点', '九点']],
    ['他怎么去学校？', ['坐公交车', '走路', '骑自行车', '开车']],
  ]),

  p(1, 'p1_night', '睡前', [
    ['My mother reads me a story every night.', '妈妈每晚给我读故事。'],
    ['Then she turns off the light.', '然后她关灯。'],
    ['I close my eyes and fall asleep.', '我闭上眼睛睡着了。'],
  ], [
    ['谁给他读故事？', ['妈妈', '爸爸', '姐姐', '老师']],
    ['读完故事后她做什么？', ['关灯', '开窗', '唱歌', '离开']],
  ]),

  p(1, 'p1_room', '我的房间', [
    ['There is a small bed in my room.', '我房间里有一张小床。'],
    ['My books are on the desk.', '我的书在桌子上。'],
    ['The window is next to the bed.', '窗户在床旁边。'],
    ['I like my room very much.', '我很喜欢我的房间。'],
  ], [
    ['他的书在哪里？', ['桌子上', '床上', '地上', '包里']],
    ['窗户在哪里？', ['床旁边', '门后面', '桌子上', '房间外']],
  ]),

  p(1, 'p1_clean', '打扫房间', [
    ['My room was very dirty last Sunday.', '上周日我的房间很脏。'],
    ['I cleaned the floor and the desk.', '我打扫了地板和桌子。'],
    ['It took me two hours.', '花了我两个小时。'],
  ], [
    ['他什么时候打扫的？', ['上周日', '上周六', '昨天', '今天早上']],
    ['花了多长时间？', ['两个小时', '一个小时', '半小时', '一整天']],
  ]),

  p(1, 'p1_laundry', '洗衣服', [
    ['My father washes his clothes on Saturday.', '爸爸周六洗衣服。'],
    ['He puts them near the window.', '他把衣服放在窗边。'],
    ['The sun dries them quickly.', '太阳很快把它们晒干。'],
  ], [
    ['爸爸什么时候洗衣服？', ['周六', '周日', '周一', '每天']],
    ['衣服放在哪里？', ['窗边', '床上', '门口', '院子里']],
  ]),

  // ---------- 饮食 ----------
  p(1, 'p1_breakfast', '早餐', [
    ['We eat bread and eggs for breakfast.', '我们早餐吃面包和鸡蛋。'],
    ['My sister drinks milk.', '我妹妹喝牛奶。'],
    ['I drink water.', '我喝水。'],
  ], [
    ['早餐吃什么？', ['面包和鸡蛋', '米饭和鱼', '面条', '水果']],
    ['妹妹喝什么？', ['牛奶', '水', '茶', '果汁']],
  ]),

  p(1, 'p1_food', '午饭', [
    ['We have lunch at twelve.', '我们十二点吃午饭。'],
    ['Today we eat rice and fish.', '今天我们吃米饭和鱼。'],
    ['I like fish very much.', '我很喜欢鱼。'],
  ], [
    ['他们几点吃午饭？', ['十二点', '十一点', '一点', '十点']],
    ['他喜欢吃什么？', ['鱼', '米饭', '肉', '菜']],
  ]),

  p(1, 'p1_tea', '喝茶', [
    ['My grandmother drinks tea every afternoon.', '奶奶每天下午喝茶。'],
    ['The tea is hot and green.', '茶是热的绿茶。'],
    ['She often sits by the window.', '她常常坐在窗边。'],
  ], [
    ['奶奶什么时候喝茶？', ['每天下午', '每天早上', '晚上', '中午']],
    ['她常坐在哪里？', ['窗边', '门口', '桌子旁', '床上']],
  ]),

  p(1, 'p1_bakery', '买面包', [
    ['My mother goes to the shop.', '我妈妈去商店。'],
    ['She buys some milk and bread.', '她买了一些牛奶和面包。'],
    ['The bread is very fresh.', '面包很新鲜。'],
  ], [
    ['妈妈买了什么？', ['牛奶和面包', '肉和菜', '水果', '鸡蛋']],
    ['面包怎么样？', ['很新鲜', '很贵', '很硬', '很甜']],
  ]),

  p(1, 'p1_market', '超市', [
    ['There are many people in the supermarket.', '超市里有很多人。'],
    ['My father buys meat and vegetables.', '爸爸买肉和蔬菜。'],
    ['I carry the bag for him.', '我帮他拎袋子。'],
  ], [
    ['爸爸买了什么？', ['肉和蔬菜', '面包和牛奶', '水果', '鱼']],
    ['他做了什么？', ['帮爸爸拎袋子', '推车', '付钱', '在外面等']],
  ]),

  p(1, 'p1_water', '喝水', [
    ['Do you drink enough water every day?', '你每天喝够水了吗？'],
    ['I drink eight cups.', '我喝八杯。'],
    ['It is good for my body.', '这对我的身体有好处。'],
  ], [
    ['他每天喝几杯水？', ['八杯', '六杯', '十杯', '四杯']],
    ['他为什么喝水？', ['对身体好', '因为渴', '医生要求', '习惯']],
  ]),

  // ---------- 天气 ----------
  p(1, 'p1_weather', '今天的天气', [
    ['It is raining today.', '今天在下雨。'],
    ['I cannot play outside.', '我不能在外面玩。'],
    ['So I stay at home and read a book.', '所以我待在家里看书。'],
  ], [
    ['今天天气怎么样？', ['下雨', '晴天', '下雪', '刮风']],
    ['他在家里做什么？', ['看书', '睡觉', '看电视', '做饭']],
  ]),

  p(1, 'p1_sunny', '晴天', [
    ['The sun is bright today.', '今天阳光明亮。'],
    ['The sky is blue and clean.', '天空又蓝又干净。'],
    ['We want to go to the park.', '我们想去公园。'],
  ], [
    ['天空是什么样的？', ['又蓝又干净', '灰色的', '有很多云', '暗的']],
    ['他们想去哪里？', ['公园', '学校', '商店', '海边']],
  ]),

  p(1, 'p1_winter', '冬天', [
    ['It is very cold in winter.', '冬天很冷。'],
    ['Snow falls on the trees and the road.', '雪落在树上和路上。'],
    ['Children make a snowman together.', '孩子们一起堆雪人。'],
  ], [
    ['雪落在哪里？', ['树上和路上', '房子上', '车上', '河里']],
    ['孩子们做什么？', ['堆雪人', '滑冰', '打雪仗', '回家']],
  ]),

  p(1, 'p1_summer', '夏天', [
    ['Summer is hot here.', '这里夏天很热。'],
    ['We often swim in the river.', '我们常在河里游泳。'],
    ['My brother eats ice cream every day.', '我弟弟每天吃冰淇淋。'],
  ], [
    ['他们常在哪里游泳？', ['河里', '海里', '游泳池', '湖里']],
    ['弟弟每天吃什么？', ['冰淇淋', '西瓜', '面包', '糖']],
  ]),

  p(1, 'p1_wind', '刮风', [
    ['The wind is strong this morning.', '今天早上风很大。'],
    ['My hat flew away.', '我的帽子被吹跑了。'],
    ['A boy helped me find it.', '一个男孩帮我找到了它。'],
  ], [
    ['什么被吹跑了？', ['帽子', '书', '伞', '纸']],
    ['谁帮了他？', ['一个男孩', '一个女孩', '他妈妈', '老师']],
  ]),

  // ---------- 上学 ----------
  p(1, 'p1_classroom', '教室', [
    ['Our classroom is big and clean.', '我们的教室又大又干净。'],
    ['There are forty desks in it.', '里面有四十张桌子。'],
    ['The blackboard is in front.', '黑板在前面。'],
  ], [
    ['教室里有多少张桌子？', ['四十张', '三十张', '五十张', '二十张']],
    ['黑板在哪里？', ['前面', '后面', '左边', '右边']],
  ]),

  p(1, 'p1_teacher', '我的老师', [
    ['My teacher is kind and patient.', '我的老师又和蔼又有耐心。'],
    ['She never gets angry with us.', '她从不对我们生气。'],
    ['All the students love her.', '所有学生都爱她。'],
  ], [
    ['老师是什么样的人？', ['和蔼有耐心', '很严厉', '很安静', '很忙']],
    ['她会对学生生气吗？', ['从不', '经常', '有时候', '每天']],
  ]),

  p(1, 'p1_homework', '做作业', [
    ['I do my homework after dinner.', '我晚饭后做作业。'],
    ['Today the math is difficult.', '今天数学很难。'],
    ['My father helps me with it.', '爸爸帮我做。'],
  ], [
    ['他什么时候做作业？', ['晚饭后', '早饭前', '上学前', '睡觉前']],
    ['今天什么很难？', ['数学', '英语', '语文', '音乐']],
  ]),

  p(1, 'p1_classmate', '同学', [
    ['Tom sits next to me in class.', '汤姆在班上坐我旁边。'],
    ['He is good at drawing.', '他擅长画画。'],
    ['We often play together after school.', '我们放学后常一起玩。'],
  ], [
    ['汤姆坐在哪里？', ['他旁边', '他后面', '他前面', '教室最后']],
    ['汤姆擅长什么？', ['画画', '唱歌', '跑步', '数学']],
  ]),

  p(1, 'p1_library_book', '借书', [
    ['Can I borrow this book?', '我能借这本书吗？'],
    ['Yes, you can keep it for two weeks.', '可以，你能借两周。'],
    ['That is great, thanks.', '太好了，谢谢。'],
  ], [
    ['能借多久？', ['两周', '一周', '一个月', '三天']],
    ['这是在哪里的对话？', ['图书馆', '商店', '学校办公室', '书店']],
  ]),

  p(1, 'p1_late', '迟到', [
    ['I was late for school yesterday.', '我昨天上学迟到了。'],
    ['The bus came very slowly.', '公交车来得很慢。'],
    ['My teacher was not angry.', '老师没生气。'],
  ], [
    ['他为什么迟到？', ['公交车来得慢', '睡过头', '走错路', '下雨']],
    ['老师的反应是？', ['没生气', '很生气', '让他站着', '罚他']],
  ]),

  p(1, 'p1_exam_simple', '小测验', [
    ['We had a short test this morning.', '今天早上我们有个小测验。'],
    ['The questions were easy.', '题目很简单。'],
    ['I finished it in ten minutes.', '我十分钟就做完了。'],
  ], [
    ['题目怎么样？', ['很简单', '很难', '很长', '很奇怪']],
    ['他用了多长时间？', ['十分钟', '半小时', '一小时', '五分钟']],
  ]),

  // ---------- 出行 ----------
  p(1, 'p1_dialog_hello', '对话：问路', [
    ['Excuse me, where is the school?', '打扰一下，学校在哪里？'],
    ['It is near the park.', '它在公园附近。'],
    ['Thank you very much.', '非常感谢。'],
    ['You are welcome.', '不客气。'],
  ], [
    ['他在找什么地方？', ['学校', '公园', '商店', '医院']],
    ['那个地方在哪里？', ['公园附近', '学校后面', '很远', '在左边']],
  ]),

  p(1, 'p1_bus', '坐公交', [
    ['The bus stop is in front of my house.', '公交站在我家前面。'],
    ['I wait there every morning.', '我每天早上在那里等。'],
    ['The bus is often full of people.', '公交车常常挤满了人。'],
  ], [
    ['公交站在哪里？', ['他家前面', '他家后面', '街角', '学校旁边']],
    ['公交车常常怎么样？', ['挤满了人', '很空', '晚点', '很快']],
  ]),

  p(1, 'p1_bike', '骑车', [
    ['My brother rides his bike to work.', '我哥哥骑车上班。'],
    ['It takes him twenty minutes.', '他要二十分钟。'],
    ['He says it is good exercise.', '他说这是很好的锻炼。'],
  ], [
    ['哥哥怎么上班？', ['骑车', '坐公交', '开车', '走路']],
    ['要多长时间？', ['二十分钟', '十分钟', '半小时', '一小时']],
  ]),

  p(1, 'p1_walk', '走路回家', [
    ['We walk home together after class.', '下课后我们一起走回家。'],
    ['The road passes a small river.', '路上会经过一条小河。'],
    ['Sometimes we stop and watch the fish.', '有时我们停下来看鱼。'],
  ], [
    ['路上经过什么？', ['一条小河', '一座桥', '一个公园', '一家商店']],
    ['他们有时停下来做什么？', ['看鱼', '买东西', '休息', '拍照']],
  ]),

  p(1, 'p1_lost_key', '找钥匙', [
    ['Where is my key?', '我的钥匙在哪里？'],
    ['I looked in my bag but it was not there.', '我在包里找了但没有。'],
    ['It was on the table all the time.', '它一直在桌子上。'],
  ], [
    ['钥匙最后在哪里？', ['桌子上', '包里', '口袋里', '门上']],
    ['他先在哪里找的？', ['包里', '桌子上', '床上', '车里']],
  ]),

  // ---------- 宠物与自然 ----------
  p(1, 'p1_cat', '我的猫', [
    ['I have a small cat.', '我有一只小猫。'],
    ['Its name is Mimi.', '它叫咪咪。'],
    ['It likes to sleep on my bed.', '它喜欢睡在我床上。'],
    ['It is very lovely.', '它很可爱。'],
  ], [
    ['猫叫什么名字？', ['咪咪', '花花', '小白', '豆豆']],
    ['猫喜欢在哪里睡觉？', ['他的床上', '沙发上', '地上', '椅子上']],
  ]),

  p(1, 'p1_dog', '遛狗', [
    ['My uncle has a big dog.', '我叔叔有一只大狗。'],
    ['They walk in the park every evening.', '他们每天傍晚在公园散步。'],
    ['The dog runs after birds.', '狗会追鸟。'],
  ], [
    ['他们什么时候散步？', ['每天傍晚', '每天早上', '周末', '中午']],
    ['狗会追什么？', ['鸟', '猫', '球', '孩子']],
  ]),

  p(1, 'p1_birds', '鸟', [
    ['Two birds live in the tree near my window.', '两只鸟住在我窗边的树上。'],
    ['They sing early in the morning.', '它们清早唱歌。'],
    ['I like their sound.', '我喜欢它们的声音。'],
  ], [
    ['有几只鸟？', ['两只', '三只', '一只', '很多']],
    ['它们什么时候唱歌？', ['清早', '傍晚', '中午', '半夜']],
  ]),

  p(1, 'p1_garden', '花园', [
    ['There are many flowers in the garden.', '花园里有很多花。'],
    ['My grandmother waters them every day.', '奶奶每天给它们浇水。'],
    ['The red ones are the most beautiful.', '红色的最漂亮。'],
  ], [
    ['谁给花浇水？', ['奶奶', '妈妈', '爷爷', '他自己']],
    ['哪种花最漂亮？', ['红色的', '黄色的', '白色的', '蓝色的']],
  ]),

  p(1, 'p1_moon', '晚上', [
    ['The moon is round tonight.', '今晚月亮是圆的。'],
    ['We sit outside and look at the sky.', '我们坐在外面看天空。'],
    ['My father tells us an old story.', '爸爸给我们讲一个老故事。'],
  ], [
    ['今晚月亮怎么样？', ['是圆的', '看不见', '很小', '被云挡住了']],
    ['爸爸做什么？', ['讲老故事', '唱歌', '看书', '睡觉']],
  ]),

  // ---------- 玩耍与爱好 ----------
  p(1, 'p1_football', '踢球', [
    ['The boys play football after school.', '男孩们放学后踢足球。'],
    ['Our team won the game.', '我们队赢了比赛。'],
    ['Everyone was very happy.', '大家都很开心。'],
  ], [
    ['比赛结果如何？', ['他们队赢了', '他们队输了', '平局', '没比完']],
    ['他们什么时候踢球？', ['放学后', '上学前', '周末', '中午']],
  ]),

  p(1, 'p1_swim', '游泳', [
    ['I learned to swim last summer.', '我去年夏天学会了游泳。'],
    ['At first I was afraid of the water.', '一开始我怕水。'],
    ['Now I swim every week.', '现在我每周都游。'],
  ], [
    ['他什么时候学会游泳的？', ['去年夏天', '今年夏天', '小时候', '上个月']],
    ['一开始他怎么样？', ['怕水', '很喜欢', '游得很好', '不想学']],
  ]),

  p(1, 'p1_drawing', '画画', [
    ['My sister draws a picture of our house.', '妹妹画了一幅我们家的画。'],
    ['She uses green for the trees.', '她用绿色画树。'],
    ['The picture is on the wall now.', '这幅画现在挂在墙上。'],
  ], [
    ['她画的是什么？', ['他们家', '一棵树', '一只猫', '学校']],
    ['画现在在哪里？', ['墙上', '桌子上', '书里', '她房间地上']],
  ]),

  p(1, 'p1_music', '听音乐', [
    ['My father listens to music when he cooks.', '爸爸做饭时听音乐。'],
    ['He likes old songs.', '他喜欢老歌。'],
    ['Sometimes he sings, too.', '有时他也跟着唱。'],
  ], [
    ['爸爸什么时候听音乐？', ['做饭时', '开车时', '睡前', '工作时']],
    ['他喜欢什么音乐？', ['老歌', '新歌', '外国歌', '安静的音乐']],
  ]),

  p(1, 'p1_tv', '看电视', [
    ['We watch TV together on Friday night.', '周五晚上我们一起看电视。'],
    ['My mother chooses the program.', '妈妈选节目。'],
    ['We eat fruit while we watch.', '我们边看边吃水果。'],
  ], [
    ['他们什么时候一起看电视？', ['周五晚上', '周六晚上', '每天', '周日下午']],
    ['谁选节目？', ['妈妈', '爸爸', '他', '大家一起']],
  ]),

  p(1, 'p1_reading', '读书', [
    ['Reading is my favorite thing.', '读书是我最喜欢的事。'],
    ['I read before I sleep every night.', '我每晚睡前读书。'],
    ['This week I am reading a book about animals.', '这周我在读一本关于动物的书。'],
  ], [
    ['他什么时候读书？', ['每晚睡前', '早上', '午饭后', '上学路上']],
    ['这周读的书是关于什么的？', ['动物', '历史', '科学', '旅行']],
  ]),

  // ---------- 社交 ----------
  p(1, 'p1_greeting', '打招呼', [
    ['Good morning! How are you today?', '早上好！你今天怎么样？'],
    ['I am fine, thank you.', '我很好，谢谢。'],
    ['See you after class.', '下课后见。'],
  ], [
    ['这是什么时候的对话？', ['早上', '晚上', '下午', '半夜']],
    ['他们什么时候再见？', ['下课后', '明天', '放学后', '午饭时']],
  ]),

  p(1, 'p1_introduce', '介绍朋友', [
    ['This is my friend Lily.', '这是我朋友莉莉。'],
    ['She comes from a small town.', '她来自一个小镇。'],
    ['She is new in our class.', '她是我们班的新同学。'],
  ], [
    ['莉莉来自哪里？', ['一个小镇', '一个大城市', '外国', '这里']],
    ['莉莉是什么身份？', ['班上的新同学', '老师', '邻居', '亲戚']],
  ]),

  p(1, 'p1_birthday', '生日', [
    ['Today is my birthday.', '今天是我的生日。'],
    ['My friends give me a big cake.', '朋友们给我一个大蛋糕。'],
    ['We sing and laugh all afternoon.', '我们唱歌笑闹了一下午。'],
  ], [
    ['朋友们给了他什么？', ['一个大蛋糕', '一本书', '一个礼物盒', '一张卡片']],
    ['他们玩了多久？', ['一下午', '一晚上', '一小时', '一整天']],
  ]),

  p(1, 'p1_thanks', '道谢', [
    ['You helped me a lot yesterday.', '你昨天帮了我很多。'],
    ['Thank you for your time.', '谢谢你花时间。'],
    ['It was nothing. I was glad to help.', '没什么，我很乐意帮忙。'],
  ], [
    ['他为什么道谢？', ['对方昨天帮了他', '对方送了礼物', '对方请客', '对方来看他']],
    ['对方怎么回答？', ['很乐意帮忙', '不用谢我', '下次注意', '别客气了']],
  ]),

  p(1, 'p1_sorry', '道歉', [
    ['I am sorry I broke your cup.', '对不起，我打碎了你的杯子。'],
    ['It is all right. Do not worry.', '没关系，别担心。'],
    ['I will buy you a new one.', '我会给你买个新的。'],
  ], [
    ['他做错了什么？', ['打碎了杯子', '弄丢了书', '迟到了', '忘了约定']],
    ['他打算怎么做？', ['买个新的', '修好它', '道歉就行', '不管了']],
  ]),

  p(1, 'p1_invite', '邀请', [
    ['Would you like to come to my house?', '你想来我家吗？'],
    ['We can play games and eat cake.', '我们可以玩游戏、吃蛋糕。'],
    ['That sounds great!', '听起来太棒了！'],
  ], [
    ['他邀请对方做什么？', ['来他家', '去公园', '一起上学', '看电影']],
    ['他们打算做什么？', ['玩游戏吃蛋糕', '看书', '踢球', '做作业']],
  ]),

  // ---------- 家庭与帮忙 ----------
  p(1, 'p1_family', '我的家', [
    ['There are four people in my family.', '我家有四口人。'],
    ['My parents work in a hospital.', '我父母在医院工作。'],
    ['My sister and I go to the same school.', '我和妹妹在同一所学校。'],
  ], [
    ['他家有几口人？', ['四口', '三口', '五口', '六口']],
    ['父母在哪里工作？', ['医院', '学校', '商店', '工厂']],
  ]),

  p(1, 'p1_help_mom', '帮妈妈', [
    ['My mother was busy in the kitchen.', '妈妈在厨房里很忙。'],
    ['I helped her wash the vegetables.', '我帮她洗菜。'],
    ['She said I was a good child.', '她说我是个好孩子。'],
  ], [
    ['他帮妈妈做了什么？', ['洗菜', '做饭', '洗碗', '扫地']],
    ['妈妈说了什么？', ['他是个好孩子', '让他去玩', '让他做作业', '谢谢他']],
  ]),

  p(1, 'p1_phone_call', '打电话', [
    ['Hello, may I speak to Tom?', '你好，请问汤姆在吗？'],
    ['He is not at home now.', '他现在不在家。'],
    ['Please tell him I called.', '请告诉他我打过电话。'],
  ], [
    ['他要找谁？', ['汤姆', '莉莉', '老师', '妈妈']],
    ['汤姆在哪里？', ['不在家', '在睡觉', '在学校', '在打电话']],
  ]),

  p(1, 'p1_cold', '感冒', [
    ['My little brother has a cold.', '我弟弟感冒了。'],
    ['He stays in bed and drinks hot water.', '他躺在床上喝热水。'],
    ['The doctor says he will be fine soon.', '医生说他很快就会好。'],
  ], [
    ['弟弟怎么了？', ['感冒了', '受伤了', '发烧了', '肚子疼']],
    ['医生怎么说？', ['他很快会好', '要住院', '要吃药', '要休息一周']],
  ]),

  p(1, 'p1_wash_hands', '洗手', [
    ['Wash your hands before dinner!', '吃饭前洗手！'],
    ['My mother says this every day.', '妈妈每天都这么说。'],
    ['Now it is my habit.', '现在这成了我的习惯。'],
  ], [
    ['妈妈让他什么时候洗手？', ['吃饭前', '吃饭后', '睡觉前', '回家后']],
    ['现在这件事对他来说是什么？', ['习惯', '麻烦', '规矩', '任务']],
  ]),

  p(1, 'p1_shopping_pen', '买笔', [
    ['How much is this pen?', '这支笔多少钱？'],
    ['It is three yuan.', '三块钱。'],
    ['I will take two, please.', '我要两支。'],
  ], [
    ['一支笔多少钱？', ['三块', '两块', '五块', '一块']],
    ['他买了几支？', ['两支', '一支', '三支', '没买']],
  ]),
];

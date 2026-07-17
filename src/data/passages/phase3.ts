// Phase 3 · 肌内固化：5-6 句，现在完成时 / 虚拟语气 / 被动 / 转折与让步
import { p } from './builder';
import type { Passage } from '../../types';

export const PHASE3: Passage[] = [
  // ---------- 职场 ----------
  p(3, 'p3_job', '入职两个月', [
    ['I have been working at this company for two months.', '我在这家公司已经工作两个月了。'],
    ['On my first day, I was so nervous that I could not say a word.', '第一天我紧张得说不出话来。'],
    ['My manager noticed it and came to talk with me.', '我的经理注意到了，走过来和我说话。'],
    ['She told me that everyone feels the same at the beginning.', '她告诉我每个人一开始都是这种感觉。'],
    ['Now I enjoy working here, and I have made several good friends.', '现在我很享受在这里工作，还交了几个好朋友。'],
  ], [
    ['他在这家公司工作多久了？', ['两个月', '两年', '两周', '两天']],
    ['第一天他为什么说不出话？', ['太紧张', '生病了', '不会英语', '在生气']],
    ['经理对他说了什么？', ['每个人一开始都这样', '让他快点适应', '批评了他', '让他回家']],
  ]),

  p(3, 'p3_promotion', '升职', [
    ['I was offered a higher position last week.', '上周公司给了我一个更高的职位。'],
    ['I should have been happy, but I hesitated for three days.', '我本该高兴，却犹豫了三天。'],
    ['The new job means more money and much less free time.', '新工作意味着更多钱和少得多的自由时间。'],
    ['If I had no children, I would have said yes at once.', '如果我没有孩子，我会当场答应。'],
    ['In the end I took it, and I am still not sure.', '最后我接了，到现在也不确定。'],
  ], [
    ['他犹豫了多久？', ['三天', '一周', '一天', '没犹豫']],
    ['他犹豫的原因是？', ['自由时间会少很多', '钱不够多', '不喜欢新岗位', '要搬家']],
    ['最后的结果是？', ['接了但仍不确定', '拒绝了', '还在考虑', '辞职了']],
  ]),

  p(3, 'p3_rejected', '面试被拒', [
    ['I had prepared for that interview for two weeks.', '那场面试我准备了两周。'],
    ['The email came on a Friday afternoon.', '邮件是周五下午来的。'],
    ['It said they had chosen someone with more experience.', '上面说他们选了经验更丰富的人。'],
    ['I was disappointed, but I asked them for advice.', '我很失望，但我向他们请教了建议。'],
    ['What they told me helped me get my next job.', '他们说的话帮我拿到了下一份工作。'],
  ], [
    ['他准备了多久？', ['两周', '一周', '三天', '一个月']],
    ['被拒的理由是什么？', ['他们选了经验更丰富的人', '他迟到了', '薪水谈不拢', '岗位取消了']],
    ['他做了什么不一样的事？', ['向对方请教建议', '再申请一次', '投诉', '什么都没做']],
  ]),

  p(3, 'p3_quit', '辞职', [
    ['She had worked there for eight years before she left.', '她在那里工作了八年才离开。'],
    ['Everybody thought she would stay until she retired.', '所有人都以为她会做到退休。'],
    ['She said the work had stopped teaching her anything.', '她说那份工作已经教不了她任何东西了。'],
    ['Her friends did not understand her decision at all.', '她的朋友完全不理解她的决定。'],
    ['A year later, she looks younger than before.', '一年后，她看起来比以前年轻。'],
  ], [
    ['她在那里工作了多久？', ['八年', '五年', '十年', '三年']],
    ['她离开的原因是？', ['工作教不了她东西了', '薪水太低', '和同事不合', '身体不好']],
    ['一年后她怎么样？', ['看起来比以前年轻', '后悔了', '找不到工作', '又回去了']],
  ]),

  p(3, 'p3_remote', '远程办公', [
    ['I have been working from home since last year.', '从去年起我一直在家办公。'],
    ['At first it seemed perfect: no traffic, no noise.', '起初似乎完美：不堵车、不吵。'],
    ['But my kitchen table has become my office.', '但我的餐桌变成了办公室。'],
    ['I often find myself answering emails at eleven at night.', '我常发现自己晚上十一点还在回邮件。'],
    ['The line between work and life has almost disappeared.', '工作和生活的界线几乎消失了。'],
  ], [
    ['他从什么时候开始在家办公？', ['去年', '今年', '两年前', '疫情时']],
    ['起初他觉得好在哪里？', ['不堵车不吵', '省钱', '时间自由', '离家人近']],
    ['现在的问题是什么？', ['工作和生活界线消失', '效率低', '太孤独', '网络不好']],
  ]),

  p(3, 'p3_colleague_left', '同事离职', [
    ['The person who taught me everything left last month.', '教会我一切的那个人上个月走了。'],
    ['I had never told her how much she had helped me.', '我从没告诉过她她帮了我多少。'],
    ['On her last day I finally said it.', '她最后一天我终于说了。'],
    ['She smiled and said she had always known.', '她笑着说她一直都知道。'],
    ['I wish I had said it much earlier.', '我真希望我早点说。'],
  ], [
    ['他一直没说什么？', ['她帮了他多少', '自己要辞职', '不喜欢她', '要送她礼物']],
    ['她的回应是？', ['她一直都知道', '很惊讶', '很感动', '没说话']],
    ['他现在的感受是？', ['后悔没早点说', '轻松了', '很难过', '无所谓']],
  ]),

  // ---------- 习惯与自我 ----------
  p(3, 'p3_habit', '早起这件事', [
    ['I used to sleep until noon on weekends.', '我以前周末总睡到中午。'],
    ['Last year I decided to change this habit.', '去年我决定改掉这个习惯。'],
    ['At first, getting up at six was really hard for me.', '一开始，六点起床对我来说真的很难。'],
    ['I have been doing it for almost a year now.', '现在我已经坚持快一年了。'],
    ['It is worth trying, because my mornings feel much longer.', '这值得一试，因为我的早晨感觉长多了。'],
  ], [
    ['他以前周末睡到几点？', ['中午', '早上八点', '下午', '十点']],
    ['他坚持早起多久了？', ['快一年', '几个月', '两年', '一周']],
    ['他觉得早起的好处是什么？', ['早晨感觉更长', '身体更好', '工作更快', '省钱']],
  ]),

  p(3, 'p3_diet', '戒糖', [
    ['My doctor told me to eat less sugar.', '医生让我少吃糖。'],
    ['I had never realized how much I was eating.', '我从没意识到自己吃了那么多。'],
    ['Even the bread I bought every day was full of it.', '连我每天买的面包里都是糖。'],
    ['The first two weeks were terrible.', '头两周很难受。'],
    ['Now fruit tastes sweeter than it ever did.', '现在水果尝起来比以前甜多了。'],
  ], [
    ['他发现了什么？', ['连面包里都是糖', '糖很贵', '医生说错了', '水果也有糖']],
    ['头两周怎么样？', ['很难受', '很轻松', '没感觉', '瘦了很多']],
    ['现在的变化是？', ['水果尝起来更甜', '不想吃东西', '睡得更好', '瘦了']],
  ]),

  p(3, 'p3_sleep', '失眠', [
    ['I have not slept well for the past month.', '过去一个月我一直睡不好。'],
    ['I lie in bed and my mind keeps working.', '我躺在床上，脑子停不下来。'],
    ['A friend told me to leave my phone in another room.', '一个朋友让我把手机放到别的房间。'],
    ['I laughed at first, but I tried it anyway.', '我起初笑了，但还是试了。'],
    ['That night I slept for eight hours.', '那晚我睡了八小时。'],
  ], [
    ['他多久睡不好了？', ['过去一个月', '一周', '半年', '几天']],
    ['朋友的建议是？', ['把手机放别的房间', '喝牛奶', '运动', '看医生']],
    ['结果如何？', ['那晚睡了八小时', '没效果', '更糟了', '第二天才好']],
  ]),

  p(3, 'p3_stress', '压力', [
    ['There have been too many things on my list lately.', '最近我的清单上事情太多了。'],
    ['I cannot help checking my phone every ten minutes.', '我忍不住每十分钟看一次手机。'],
    ['My wife asked me to walk with her after dinner.', '妻子让我晚饭后和她散步。'],
    ['We do not talk about work during those walks.', '散步时我们不聊工作。'],
    ['Those thirty minutes have become the best part of my day.', '那三十分钟成了我一天中最好的时光。'],
  ], [
    ['他的习惯问题是什么？', ['每十分钟看手机', '熬夜', '不吃饭', '抽烟']],
    ['散步时他们不聊什么？', ['工作', '孩子', '钱', '家人']],
    ['他怎么评价那三十分钟？', ['一天中最好的时光', '浪费时间', '太短', '很累']],
  ]),

  p(3, 'p3_english', '学英语的挫折', [
    ['I have studied English since I was ten.', '我十岁起就学英语。'],
    ['I can read a newspaper without any problem.', '我读报纸完全没问题。'],
    ['But when someone speaks to me, my mind goes blank.', '但别人跟我说话时，我脑子一片空白。'],
    ['I have always translated everything in my head first.', '我一直都在脑子里先翻译。'],
    ['If I had listened more and read less, things might be different.', '如果我当初多听少读，情况可能不一样。'],
  ], [
    ['他的强项是什么？', ['读报纸没问题', '口语', '听力', '写作']],
    ['他的问题是什么？', ['别人说话时脑子空白', '词汇量小', '语法差', '发音不准']],
    ['他觉得原因是？', ['一直在脑子里先翻译', '学得太晚', '不够努力', '没有环境']],
  ]),

  p(3, 'p3_phone_addict', '手机依赖', [
    ['My phone tells me how long I use it every week.', '我的手机每周告诉我用了多久。'],
    ['Last week the number was over forty hours.', '上周这个数字超过四十小时。'],
    ['That is almost a full working week.', '那几乎是一个完整的工作周。'],
    ['I have tried to put it away, but my hand finds it by itself.', '我试过把它收起来，但我的手会自己找到它。'],
    ['If I had those hours back, I could learn a language.', '如果那些时间能还给我，我能学会一门语言。'],
  ], [
    ['上周他用了多久手机？', ['超过四十小时', '二十小时', '三十小时', '六十小时']],
    ['他试过什么办法？', ['把手机收起来', '删掉应用', '关机', '换旧手机']],
    ['他的感慨是？', ['那些时间够学一门语言', '要少用手机', '手机很有用', '控制不住']],
  ]),

  // ---------- 人际 ----------
  p(3, 'p3_fight', '和朋友吵架', [
    ['We had not spoken to each other for six months.', '我们有六个月没说过话。'],
    ['The argument had started over something very small.', '争吵起因非常小。'],
    ['Neither of us could remember who said it first.', '我们谁都想不起是谁先说的。'],
    ['Last week I sent him a photo from our school days.', '上周我给他发了一张学生时代的照片。'],
    ['He called me one minute later.', '一分钟后他就打来了电话。'],
  ], [
    ['他们多久没说话？', ['六个月', '三个月', '一年', '两个月']],
    ['争吵的起因是？', ['非常小的事', '钱', '工作', '误会']],
    ['是什么打破了僵局？', ['一张学生时代的照片', '一句道歉', '朋友劝和', '偶然遇见']],
  ]),

  p(3, 'p3_comfort', '安慰朋友', [
    ['My friend lost her job two weeks ago.', '我朋友两周前失业了。'],
    ['I did not know what I should say to her.', '我不知道该对她说什么。'],
    ['So I just sat with her and made tea.', '所以我只是陪她坐着、泡茶。'],
    ['She talked for two hours and I listened.', '她说了两个小时，我听着。'],
    ['Later she told me that was exactly what she had needed.', '后来她告诉我那正是她需要的。'],
  ], [
    ['他做了什么？', ['陪她坐着泡茶听她说', '给她建议', '帮她找工作', '借钱给她']],
    ['她说了多久？', ['两个小时', '一小时', '一下午', '几分钟']],
    ['她后来的评价是？', ['那正是她需要的', '希望得到建议', '觉得没用', '很感动']],
  ]),

  p(3, 'p3_miss_home', '想念家乡', [
    ['I have lived in this city for ten years.', '我在这座城市住了十年。'],
    ['Everything I need is here, and yet something is missing.', '我需要的一切都在这里，可总缺点什么。'],
    ['Last month I went back to my hometown for three days.', '上个月我回老家待了三天。'],
    ['The streets had changed, but the smell of the air had not.', '街道变了，但空气的味道没变。'],
    ['I cried in the taxi, and I could not explain why.', '我在出租车里哭了，说不清为什么。'],
  ], [
    ['他在这座城市住了多久？', ['十年', '五年', '二十年', '三年']],
    ['老家什么没变？', ['空气的味道', '街道', '老房子', '邻居']],
    ['他在出租车里怎么了？', ['哭了但说不清为什么', '睡着了', '很开心', '打电话']],
  ]),

  p(3, 'p3_parents', '父母老了', [
    ['My father has always been the strongest man I knew.', '父亲一直是我认识的最强壮的人。'],
    ['Last month I saw him stop to rest on the stairs.', '上个月我看见他在楼梯上停下来休息。'],
    ['He said nothing, and neither did I.', '他什么也没说，我也是。'],
    ['That evening I booked a check-up for him at the hospital.', '那天晚上我给他约了医院检查。'],
    ['Some things cannot be talked about, only done.', '有些事没法说，只能做。'],
  ], [
    ['他看到父亲怎么了？', ['在楼梯上停下休息', '摔倒了', '生病了', '瘦了']],
    ['当时父子俩的反应？', ['都什么也没说', '聊了很久', '争执起来', '父亲解释了']],
    ['他做了什么？', ['给父亲约了医院检查', '搬回家住', '请了护工', '劝父亲锻炼']],
  ]),

  p(3, 'p3_child', '孩子长大', [
    ['My daughter used to hold my hand everywhere.', '我女儿以前去哪都牵着我的手。'],
    ['Now she walks three steps in front of me.', '现在她走在我前面三步。'],
    ['She would rather talk to her friends than to us.', '她宁愿跟朋友说话也不跟我们说。'],
    ['I know this is normal and it should make me glad.', '我知道这很正常，也该为此高兴。'],
    ['Still, I miss those small fingers.', '可我还是想念那双小手指。'],
  ], [
    ['女儿现在怎么走路？', ['走在他前面三步', '还是牵着手', '不肯出门', '跟朋友走']],
    ['他知道这意味着什么？', ['这很正常，该高兴', '她变坏了', '她讨厌他', '要管管她']],
  ]),

  p(3, 'p3_pet_duty', '养宠物的责任', [
    ['My son had asked for a dog for two years.', '我儿子要了两年的狗。'],
    ['He promised he would walk it every single day.', '他保证会每天遛它。'],
    ['We have had the dog for six months now.', '狗养到现在六个月了。'],
    ['Guess who walks it in the rain at seven in the morning.', '猜猜早上七点下雨天是谁在遛它。'],
    ['I do not mind as much as I thought I would.', '我并不像自己以为的那么介意。'],
  ], [
    ['儿子保证了什么？', ['每天遛狗', '自己喂', '不影响学习', '不哭闹']],
    ['实际是谁在遛狗？', ['说话人自己', '儿子', '妻子', '轮流']],
    ['他的态度是？', ['没自己以为的那么介意', '很生气', '很后悔', '要把狗送走']],
  ]),

  // ---------- 旅行意外 ----------
  p(3, 'p3_travel', '错过的火车', [
    ['I had planned to take the early train to the city.', '我本来计划坐早班火车进城。'],
    ['But I woke up late because my phone did not ring.', '但是我睡过头了，因为我手机没响。'],
    ['By the time I reached the station, the train had already left.', '等我到车站的时候，火车已经开走了。'],
    ['I had to wait two hours for the next one.', '我不得不等两个小时坐下一班。'],
    ['If I had gone to bed earlier, I would not have missed it.', '如果我早点睡，就不会错过了。'],
  ], [
    ['他为什么睡过头？', ['手机没响', '太累了', '忘了定闹钟', '停电了']],
    ['他到车站时发生了什么？', ['火车已经开走了', '火车晚点了', '车站关门了', '票卖完了']],
    ['他后悔什么？', ['没有早点睡', '没有打车', '没有买票', '没有带手机']],
  ]),

  p(3, 'p3_flight_cancel', '航班取消', [
    ['Our flight was cancelled because of the storm.', '我们的航班因为风暴取消了。'],
    ['Hundreds of people were waiting in one long line.', '几百人排在一条长队里。'],
    ['A woman behind me was crying on the phone.', '我后面一个女人在电话里哭。'],
    ['She had been trying to get home for her father.', '她一直想赶回家看她父亲。'],
    ['The man at the desk gave her the last seat.', '柜台的人把最后一个座位给了她。'],
  ], [
    ['航班为什么取消？', ['风暴', '机械故障', '罢工', '雾']],
    ['那个女人为什么哭？', ['一直想赶回家看父亲', '丢了行李', '钱不够', '错过了会议']],
    ['结果如何？', ['柜台把最后一个座位给了她', '她没走成', '她改签了', '大家帮她']],
  ]),

  p(3, 'p3_luggage', '行李丢了', [
    ['My bag did not come out at the airport.', '我的行李在机场没出来。'],
    ['I waited until the belt stopped moving.', '我一直等到传送带停下。'],
    ['Everything I needed for the meeting was inside it.', '开会要用的东西全在里面。'],
    ['I bought a shirt at the airport shop that night.', '那晚我在机场商店买了件衬衫。'],
    ['The bag arrived two days later, after the meeting had ended.', '行李两天后才到，会议已经结束了。'],
  ], [
    ['行李里有什么？', ['开会要用的东西', '衣服和礼物', '电脑', '证件']],
    ['他当晚怎么办的？', ['在机场买了件衬衫', '借了衣服', '推迟会议', '穿旧的']],
    ['行李什么时候到的？', ['两天后，会议已结束', '第二天', '当晚', '一周后']],
  ]),

  p(3, 'p3_lost_city', '在陌生城市迷路', [
    ['My phone had no signal in that old part of town.', '在那片老城区我手机没信号。'],
    ['I had been walking in circles for half an hour.', '我已经绕了半小时的圈。'],
    ['An old woman saw me and pointed at a street.', '一位老太太看见我，指了一条街。'],
    ['We could not understand each other at all.', '我们完全听不懂对方说话。'],
    ['She walked with me for ten minutes until I found my hotel.', '她陪我走了十分钟，直到我找到酒店。'],
  ], [
    ['他遇到什么问题？', ['手机没信号，绕圈半小时', '钱包丢了', '天黑了', '下雨了']],
    ['他和老太太能沟通吗？', ['完全听不懂对方', '能简单交流', '用手机翻译', '她会英语']],
    ['老太太做了什么？', ['陪他走了十分钟到酒店', '画了地图', '叫了车', '找人帮忙']],
  ]),

  p(3, 'p3_language', '语言不通', [
    ['I had learned some words before the trip.', '旅行前我学了一些词。'],
    ['But nobody speaks as slowly as the app does.', '但没人像应用里说得那么慢。'],
    ['In the restaurant I just pointed at another table.', '在餐厅我只好指了指别人的桌子。'],
    ['The waiter laughed and brought me the same dish.', '服务员笑了，给我上了同样的菜。'],
    ['It turned out to be the best meal of the week.', '那竟成了那周最好吃的一顿。'],
  ], [
    ['他发现的问题是？', ['没人像应用里说得那么慢', '词学少了', '口音太重', '语法不对']],
    ['他在餐厅怎么点的餐？', ['指别人的桌子', '用翻译软件', '看图片', '让服务员推荐']],
    ['结果如何？', ['成了那周最好吃的一顿', '上错了菜', '很难吃', '很贵']],
  ]),

  p(3, 'p3_dialog_help', '对话：搬家', [
    ['I heard you are moving to a new place next month.', '我听说你下个月要搬到新地方。'],
    ['Yes, I have been looking for a bigger flat for half a year.', '是的，我找更大的公寓已经找了半年了。'],
    ['Do you need any help with moving your things?', '搬东西需要帮忙吗？'],
    ['That would be great. I have more books than I thought.', '那太好了。我的书比我想的还多。'],
    ['Let me know the date, and I will come with my car.', '告诉我日期，我开车过来。'],
  ], [
    ['他找新公寓找了多久？', ['半年', '一个月', '两年', '一周']],
    ['他搬家时的主要困难是什么？', ['书太多', '没有车', '东西太重', '时间不够']],
    ['对方打算怎么帮忙？', ['开车来帮忙', '找人来帮忙', '给他钱', '帮他打包']],
  ]),

  // ---------- 消费与金钱 ----------
  p(3, 'p3_save', '存钱买房', [
    ['We have been saving money for six years.', '我们已经存了六年钱。'],
    ['Every month a part of my pay goes straight to the bank.', '每个月一部分工资直接进银行。'],
    ['We have not taken a real holiday since we started.', '开始存钱后我们没休过一次真正的假。'],
    ['Sometimes I wonder whether it is worth it.', '有时我想这值不值。'],
    ['Then I look at my son and I keep going.', '然后我看看儿子，就继续下去。'],
  ], [
    ['他们存了多久？', ['六年', '三年', '十年', '两年']],
    ['为了存钱他们放弃了什么？', ['没休过真正的假', '换车', '孩子的兴趣班', '看病']],
    ['是什么让他坚持？', ['看看儿子', '妻子的鼓励', '房价上涨', '习惯了']],
  ]),

  p(3, 'p3_car', '二手车', [
    ['The car had been used for five years before I bought it.', '我买之前那车已经开了五年。'],
    ['The seller told me everything was perfect.', '卖家告诉我一切完美。'],
    ['Two weeks later a strange sound came from the engine.', '两周后发动机传来奇怪的声音。'],
    ['The repair cost me almost half of the price of the car.', '修车花了我几乎半个车价。'],
    ['I should have asked a friend who knows cars to come with me.', '我本该叫个懂车的朋友一起去。'],
  ], [
    ['车买之前开了几年？', ['五年', '三年', '两年', '八年']],
    ['修车花了多少？', ['几乎半个车价', '一点点', '比车还贵', '保修免费']],
    ['他觉得自己错在哪？', ['没叫懂车的朋友同去', '买得太急', '没试车', '没砍价']],
  ]),

  p(3, 'p3_complain', '餐厅投诉', [
    ['The soup was brought to our table cold.', '汤端上来是凉的。'],
    ['My friend wanted to say nothing and just leave.', '我朋友想什么都不说直接走。'],
    ['I called the waiter and told him quietly.', '我叫来服务员，低声告诉他。'],
    ['He changed it at once and did not charge us for it.', '他立刻换了，而且没收我们的钱。'],
    ['Saying something politely is often better than saying nothing.', '礼貌地说出来，常常比什么都不说好。'],
  ], [
    ['汤有什么问题？', ['是凉的', '太咸', '有头发', '上错了']],
    ['朋友想怎么做？', ['什么都不说直接走', '大声投诉', '要求退钱', '再点一份']],
    ['结果如何？', ['立刻换了且没收钱', '被拒绝了', '等了很久', '打了折']],
  ]),

  p(3, 'p3_shop_regret', '冲动消费', [
    ['I had wanted that machine for months.', '那台机器我想要好几个月了。'],
    ['When it was finally cheaper, I bought it in one minute.', '它终于便宜了，我一分钟就买了。'],
    ['It has been standing in the corner since then.', '从那以后它就一直立在墙角。'],
    ['I have used it exactly twice.', '我总共用过两次。'],
    ['Now I wait a week before I buy anything I want.', '现在我想买什么会先等一周。'],
  ], [
    ['他用过几次？', ['两次', '一次', '很多次', '一次都没用']],
    ['他现在的做法是？', ['想买什么先等一周', '不再网购', '记账', '把东西卖掉']],
  ]),

  // ---------- 生活与社会 ----------
  p(3, 'p3_volunteer', '做志愿者', [
    ['I had never thought I would spend my Saturday like this.', '我从没想过会这样度过周六。'],
    ['We were painting the walls of an old school.', '我们在给一所旧学校刷墙。'],
    ['By noon my arms could hardly move.', '到中午我胳膊几乎抬不起来。'],
    ['The children brought us water and drew pictures for us.', '孩子们给我们送水，还给我们画画。'],
    ['I have gone back every month since then.', '从那以后我每个月都回去。'],
  ], [
    ['他们在做什么？', ['给旧学校刷墙', '教孩子读书', '打扫公园', '送物资']],
    ['孩子们做了什么？', ['送水并画画给他们', '一起刷墙', '在旁边看', '唱歌']],
    ['之后他怎么做的？', ['每个月都回去', '再没去过', '带朋友去', '捐了钱']],
  ]),

  p(3, 'p3_garbage', '垃圾分类', [
    ['Our building started sorting garbage last spring.', '去年春天我们楼开始垃圾分类。'],
    ['At first everyone complained about the extra work.', '起初大家都抱怨多出来的麻烦。'],
    ['An old man stood by the bins every evening to help.', '一位老人每天傍晚站在垃圾桶边帮忙。'],
    ['Nobody had asked him to do it.', '没人要求他这么做。'],
    ['Six months later, the complaints have stopped.', '六个月后，抱怨声消失了。'],
  ], [
    ['起初大家的反应是？', ['抱怨麻烦', '很支持', '不理会', '搬走了']],
    ['老人为什么这么做？', ['没人要求，他自愿的', '被安排的', '有报酬', '是管理员']],
    ['六个月后怎么样？', ['抱怨声消失了', '大家还是抱怨', '制度取消了', '老人走了']],
  ]),

  p(3, 'p3_news', '假消息', [
    ['A message about our city was sent to everyone yesterday.', '昨天一条关于我们城市的消息发给了所有人。'],
    ['My mother called me and she was really afraid.', '我妈打电话给我，她真的很害怕。'],
    ['I searched for it and found nothing on any real news site.', '我查了，正规新闻网站上什么都没有。'],
    ['By the evening, the message had been proved false.', '到晚上，那条消息被证明是假的。'],
    ['But by then half the city had already believed it.', '但那时半个城市已经信了。'],
  ], [
    ['妈妈的反应是？', ['真的很害怕', '不相信', '转发了', '打电话确认']],
    ['他做了什么？', ['去正规新闻网站查', '直接相信', '转发提醒', '报警']],
    ['最后的问题是什么？', ['半个城市已经信了', '没人在意', '发布者被抓', '消息是真的']],
  ]),

  p(3, 'p3_social', '社交媒体', [
    ['Her life looks perfect in every photo.', '她每张照片里的生活都很完美。'],
    ['We had lunch together last week for the first time in years.', '上周我们多年来第一次一起吃午饭。'],
    ['She told me she had been feeling lonely for a long time.', '她告诉我她孤独很久了。'],
    ['I would never have guessed it from her pictures.', '从她的照片我绝对猜不到。'],
    ['We only show the part we want to be seen.', '我们只展示想被看见的那一面。'],
  ], [
    ['她的照片给人什么印象？', ['生活很完美', '很普通', '很忙', '不常发']],
    ['她实际的状态是？', ['孤独很久了', '很快乐', '很忙', '生病了']],
    ['说话人的结论是？', ['人只展示想被看见的一面', '照片会骗人', '不该用社交媒体', '她在演戏']],
  ]),

  p(3, 'p3_cake', '烤蛋糕失败', [
    ['I had followed every step in the book.', '我照着书上每一步做的。'],
    ['The cake came out as flat as a plate.', '蛋糕烤出来像盘子一样平。'],
    ['My daughter said it looked like a big cookie.', '我女儿说它像块大饼干。'],
    ['We ate the whole thing with ice cream anyway.', '我们还是配着冰淇淋把它吃完了。'],
    ['She has asked me to make that big cookie again.', '她已经让我再做一次那块大饼干了。'],
  ], [
    ['蛋糕怎么了？', ['扁得像盘子', '烤糊了', '没熟', '太甜']],
    ['女儿说它像什么？', ['一块大饼干', '一张纸', '面包', '石头']],
    ['后来女儿要求什么？', ['再做一次那块大饼干', '别再做了', '买现成的', '教她做']],
  ]),

  p(3, 'p3_repair', '修东西', [
    ['The chair had been broken for three months.', '那把椅子坏了三个月。'],
    ['Every time I walked past it, I told myself I would fix it.', '每次路过我都告诉自己会修。'],
    ['Last Sunday it took me exactly eleven minutes.', '上周日我用了整整十一分钟修好。'],
    ['I had spent three months avoiding an eleven-minute job.', '我花了三个月躲一件十一分钟的活。'],
    ['I wonder what else on my list is like that chair.', '我在想清单上还有多少事像那把椅子。'],
  ], [
    ['椅子坏了多久？', ['三个月', '一年', '一个月', '一周']],
    ['修好用了多久？', ['十一分钟', '一小时', '一下午', '两天']],
    ['他的感悟是？', ['花三个月躲一件十一分钟的活', '要请人修', '椅子该扔了', '自己很懒']],
  ]),

  p(3, 'p3_year', '回顾这一年', [
    ['I looked at the notes I had written last January.', '我看了看去年一月写的笔记。'],
    ['I had promised myself five big things.', '我给自己许了五件大事。'],
    ['Only one of them has been finished.', '只完成了一件。'],
    ['But three things I had never planned turned out to matter more.', '但三件我从没计划过的事反而更重要。'],
    ['Perhaps a year is not a line but a road with turns.', '也许一年不是一条直线，而是有拐弯的路。'],
  ], [
    ['他许了几件大事？', ['五件', '三件', '十件', '一件']],
    ['完成了几件？', ['一件', '三件', '五件都完成了', '一件都没有']],
    ['他的结论是？', ['一年不是直线而是有拐弯的路', '计划没用', '自己太懒', '明年要努力']],
  ]),

  p(3, 'p3_neighbor_fight', '邻里纠纷', [
    ['The family upstairs had been fighting almost every night.', '楼上那家几乎每晚都在吵。'],
    ['We could hear doors and voices through the floor.', '我们隔着楼板能听见摔门和喊声。'],
    ['My wife wanted to call someone, but I said we should wait.', '我妻子想报警，但我说再等等。'],
    ['One morning we met the woman in the lift, and she looked away.', '一天早上我们在电梯里遇见那位太太，她别过脸去。'],
    ['I still do not know whether waiting was right.', '我到现在也不知道等待是不是对的。'],
  ], [
    ['楼上发生了什么？', ['几乎每晚吵架', '装修', '开派对', '养狗']],
    ['妻子想怎么做？', ['报警', '上去劝', '搬走', '写纸条']],
    ['他现在的想法是？', ['不知道等待是否正确', '当初该报警', '不关自己的事', '后悔搬来']],
  ]),

  p(3, 'p3_old_friend', '老朋友', [
    ['We had not met for fifteen years.', '我们十五年没见了。'],
    ['I was afraid we would have nothing to say.', '我担心我们会无话可说。'],
    ['The first five minutes were indeed difficult.', '头五分钟确实很尴尬。'],
    ['Then he mentioned our old teacher, and everything came back.', '然后他提起我们的老师，一切都回来了。'],
    ['We talked until the restaurant closed.', '我们聊到餐厅打烊。'],
  ], [
    ['他们多久没见了？', ['十五年', '十年', '五年', '二十年']],
    ['他事先担心什么？', ['会无话可说', '认不出对方', '对方变了', '尴尬']],
    ['是什么打开了话匣子？', ['提起老师', '看老照片', '喝了酒', '聊工作']],
  ]),

  p(3, 'p3_retire', '退休计划', [
    ['My uncle has been counting the days to his retirement.', '我叔叔一直在数退休的日子。'],
    ['He has planned to travel around the country by car.', '他计划开车环游全国。'],
    ['Last week the day finally came.', '上周那天终于到了。'],
    ['He got up at six on Monday out of habit.', '周一他习惯性六点就起了。'],
    ['Then he sat in the kitchen, not knowing what to do.', '然后他坐在厨房里，不知道该做什么。'],
  ], [
    ['他的退休计划是？', ['开车环游全国', '带孙子', '钓鱼', '回老家']],
    ['退休第一个周一他怎么样？', ['习惯性六点起然后不知所措', '睡到中午', '立刻出发', '很开心']],
  ]),

  p(3, 'p3_gift_wrong', '送错礼物', [
    ['I had spent a week choosing a present for her.', '我花了一周给她挑礼物。'],
    ['When she opened it, she said it was lovely.', '她打开时说很可爱。'],
    ['But I saw her face for half a second before she smiled.', '但在她微笑前，我看到了她半秒的表情。'],
    ['The gift has never appeared in her house since.', '从那以后那礼物再没在她家出现过。'],
    ['Next time I will simply ask her what she wants.', '下次我会直接问她想要什么。'],
  ], [
    ['他挑礼物花了多久？', ['一周', '一天', '一个月', '几分钟']],
    ['他从哪里看出问题？', ['她微笑前半秒的表情', '她说的话', '她退了礼物', '朋友告诉他']],
    ['他的打算是？', ['下次直接问她想要什么', '不再送礼', '送贵的', '送同样的']],
  ]),

  p(3, 'p3_promise', '答应帮忙', [
    ['I had said yes before I looked at my week.', '我还没看这周的安排就答应了。'],
    ['By Wednesday I had three things I could not finish.', '到周三我有三件事完不成。'],
    ['I had to call him and take back my word.', '我不得不打电话给他，收回承诺。'],
    ['He was kind about it, which made it worse.', '他很体谅，这反而让我更难受。'],
    ['Now I always check my week before I answer.', '现在我回答前一定先看这周的安排。'],
  ], [
    ['他犯的错是什么？', ['没看安排就答应', '忘了这件事', '答应了两个人', '做错了事']],
    ['对方的反应是？', ['很体谅', '很生气', '不理他', '找了别人']],
    ['他现在怎么做？', ['回答前先看这周安排', '不再答应任何人', '直接拒绝', '硬着头皮做']],
  ]),

  p(3, 'p3_apology', '迟到的道歉', [
    ['I had been wrong, and I had known it for years.', '我错了，而且我知道很多年了。'],
    ['Every time I picked up the phone, I put it down again.', '每次拿起电话，我又放下。'],
    ['Last month I wrote him a letter instead.', '上个月我改成给他写了封信。'],
    ['He answered with only four words: I had forgotten it.', '他只回了四个词：我早忘了。'],
    ['I read those words twenty times.', '那几个字我读了二十遍。'],
  ], [
    ['他知道自己错了多久？', ['很多年', '几个月', '几天', '刚知道']],
    ['他最后用什么方式道歉？', ['写信', '打电话', '当面', '发消息']],
    ['对方回了什么？', ['我早忘了', '不原谅', '没回', '骂了他']],
  ]),

  p(3, 'p3_new_city', '搬到新城市', [
    ['I have been in this city for three months.', '我到这座城市三个月了。'],
    ['I can find the supermarket and the subway without a map.', '我不用地图就能找到超市和地铁。'],
    ['But I still do not know anyone well enough to call at night.', '但我还没有一个熟到能半夜打电话的人。'],
    ['Yesterday a woman in the lift asked about my plant.', '昨天电梯里一位女士问起我的植物。'],
    ['We talked for two floors, and it made my whole day.', '我们聊了两层楼的时间，我一整天都很好。'],
  ], [
    ['他来这座城市多久了？', ['三个月', '一年', '一个月', '半年']],
    ['他还缺什么？', ['熟到能半夜打电话的人', '工作', '房子', '钱']],
    ['电梯里发生了什么？', ['有人问起他的植物，聊了两层楼', '没人说话', '遇到同事', '有人帮他']],
  ]),

  p(3, 'p3_start_over', '重新开始', [
    ['At forty, he went back to school.', '四十岁时，他重新回到学校。'],
    ['His classmates were half his age.', '他的同学只有他一半年纪。'],
    ['For the first month he sat at the back and said nothing.', '头一个月他坐在最后排，一句话不说。'],
    ['A young student asked him to join their group.', '一个年轻学生请他加入他们的小组。'],
    ['He has told me that was the moment he stopped feeling old.', '他告诉我，那一刻他不再觉得自己老了。'],
  ], [
    ['他多大回学校的？', ['四十岁', '三十岁', '五十岁', '三十五岁']],
    ['头一个月他怎么样？', ['坐最后排一句话不说', '很活跃', '想退学', '成绩很好']],
    ['转折点是什么？', ['一个年轻学生请他加入小组', '考试得高分', '老师鼓励', '习惯了']],
  ]),

  p(3, 'p3_umbrella_shared', '共伞', [
    ['The rain had been falling since early morning.', '雨从清早就一直在下。'],
    ['I was standing at the door of the shop, waiting for it to stop.', '我站在店门口等雨停。'],
    ['A stranger opened his umbrella and looked at me.', '一个陌生人撑开伞看着我。'],
    ['We walked together to the corner without saying a word.', '我们一言不发地一起走到街角。'],
    ['He turned left, I turned right, and I never saw him again.', '他向左，我向右，我再也没见过他。'],
  ], [
    ['雨下了多久？', ['从清早一直下', '刚开始下', '下了一夜', '下了几分钟']],
    ['他们一路上说了什么？', ['一言不发', '聊了很多', '互相道谢', '问了名字']],
    ['最后怎么样？', ['各走各的，再没见过', '成了朋友', '交换了电话', '他送他回家']],
  ]),

  p(3, 'p3_late_night_work', '深夜办公室', [
    ["By ten o'clock the whole floor had gone quiet.", '到十点整层楼都安静了。'],
    ["Only my lamp and the cleaner's radio were still on.", '只剩我的台灯和清洁工的收音机还开着。'],
    ['She asked me why young people never go home.', '她问我年轻人为什么从不回家。'],
    ['I did not have a good answer for her.', '我给不出一个像样的回答。'],
    ['I packed my bag and left with her that night.', '那晚我收拾包，和她一起走了。'],
  ], [
    ['十点时办公室还剩什么？', ['他的台灯和清洁工的收音机', '很多人在加班', '只有他一个人', '灯全关了']],
    ['清洁工问了什么？', ['年轻人为什么从不回家', '他在忙什么', '要不要帮忙', '什么时候走']],
    ['他最后怎么做的？', ['收拾包和她一起走', '继续加班', '解释了原因', '在公司睡了']],
  ]),

  p(3, 'p3_bad_habit', '改掉一个毛病', [
    ['I had been late for almost every meeting for years.', '多年来我几乎每个会都迟到。'],
    ['I always thought five minutes did not matter.', '我总觉得五分钟没什么。'],
    ['Then a colleague said she had stopped counting on me.', '后来一位同事说她已经不指望我了。'],
    ['Those words stayed in my head for a whole week.', '那句话在我脑子里待了整整一周。'],
    ['I have not been late since that day.', '从那天起我再没迟到过。'],
  ], [
    ['他的毛病是什么？', ['几乎每个会都迟到', '不回消息', '忘事', '打断别人']],
    ['同事说了什么？', ['她已经不指望他了', '让他改', '很生气', '要报告上级']],
    ['结果如何？', ['从那天起再没迟到', '偶尔还迟到', '和同事吵架', '换了部门']],
  ]),

  p(3, 'p3_first_snow', '第一场雪', [
    ['My friend from the south had never seen snow.', '我南方来的朋友从没见过雪。'],
    ['It started falling while we were having dinner.', '我们吃晚饭时开始下了。'],
    ['She ran out with no coat and stood in the street.', '她没穿外套就跑出去站在街上。'],
    ['People walking past must have thought she was strange.', '路过的人一定觉得她很奇怪。'],
    ['She said it was the quietest sound she had ever heard.', '她说那是她听过最安静的声音。'],
  ], [
    ['朋友来自哪里？', ['南方', '北方', '国外', '山里']],
    ['她跑出去时怎么样？', ['没穿外套', '带了相机', '叫上了大家', '打着伞']],
    ['她怎么形容雪？', ['听过最安静的声音', '很冷', '很美', '像糖']],
  ]),
];

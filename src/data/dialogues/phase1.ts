// Phase 1 冷启动：短句、日常高频场景，每篇 3-4 次接话
import type { Dialogue } from '../../types';
import { d } from './builder';

export const PHASE1_DIALOGUES: Dialogue[] = [
  d(1, 'd1-checkout', '超市结账', '你在超市收银台，正把东西放上传送带。', [
    ['p', 'Hi there. Did you find everything okay?', '你好，都找到了吗？'],
    ['y', 'Yes, thanks.', '找到了，谢谢。', '回答找到了，道个谢'],
    ['p', 'Do you need a bag?', '需要袋子吗？'],
    ['y', "No, I brought my own.", '不用，我自己带了。', '说不用，你自己带了袋子'],
    ['p', "That's four ninety. Card or cash?", '四块九。刷卡还是现金？'],
    ['y', 'Card, please.', '刷卡。', '说你要刷卡'],
    ['p', 'Perfect. Have a nice day!', '好嘞，祝你今天愉快！'],
    ['y', 'You too. Thanks.', '你也是，谢谢。', '回一句「你也一样」'],
  ]),

  d(1, 'd1-coffee', '咖啡店点单', '你在咖啡店柜台前，后面还排着人。', [
    ['p', 'What can I get you?', '想要点什么？'],
    ['y', 'A flat white, please.', '一杯馥芮白，谢谢。', '点一杯咖啡'],
    ['p', 'Sure. To have here or take away?', '好的。堂食还是带走？'],
    ['y', 'Take away, please.', '带走，谢谢。', '说你要带走'],
    ['p', "Any milk? We've got oat and soy.", '要加奶吗？有燕麦奶和豆奶。'],
    ['y', 'Oat milk, please.', '燕麦奶，谢谢。', '选燕麦奶'],
    ['p', "Three fifty. What's the name for the order?", '三块五。请问怎么称呼？'],
    ['y', "It's Ash.", '我叫 Ash。', '报上你的名字'],
  ]),

  d(1, 'd1-directions', '问路', '你在街上迷路了，看到一个路人。', [
    ['y', 'Excuse me, how do I get to the station?', '打扰一下，请问车站怎么走？', '拦住路人，问车站怎么走'],
    ['p', 'The station? Go straight down this road and turn left at the lights.', '车站？沿这条路直走，到红绿灯左转。'],
    ['y', 'Is it far?', '远吗？', '问远不远'],
    ['p', "About ten minutes on foot. You'll see it on your right.", '走路大概十分钟，在你右手边。'],
    ['y', 'Thank you so much.', '太谢谢你了。', '道谢'],
    ['p', 'No problem. Have a good one.', '不客气，一切顺利。'],
  ]),

  d(1, 'd1-neighbour', '邻居打招呼', '你刚搬来，在楼道里碰到一个邻居。', [
    ['p', "Morning! You're the new neighbour, right?", '早上好！你是新搬来的吧？'],
    ['y', 'Yes, I moved in last week.', '是的，我上周搬来的。', '承认，说你上周搬来的'],
    ['p', "Welcome! I'm Tom, I live upstairs.", '欢迎！我叫 Tom，住楼上。'],
    ['y', "Nice to meet you. I'm Ash.", '很高兴认识你，我叫 Ash。', '自我介绍'],
    ['p', 'If you need anything, just knock.', '有需要就来敲门。'],
    ['y', "That's very kind, thanks.", '你人真好，谢谢。', '谢谢他的好意'],
  ]),

  d(1, 'd1-delivery', '快递签收', '门铃响了，快递员站在门口。', [
    ['p', 'Delivery for flat 3B. Can you sign here?', '3B 的快递。能在这儿签个字吗？'],
    ['y', 'Sure, one second.', '好的，稍等一下。', '答应，让他等一下'],
    ['p', "It's a bit heavy, sorry.", '有点沉，不好意思。'],
    ['y', "That's fine. Where do I sign?", '没事。在哪儿签？', '说没关系，问在哪儿签'],
    ['p', 'Just here, with your finger.', '就这儿，用手指签。'],
    ['y', 'Done. Thanks a lot.', '好了，多谢。', '签好了，道谢'],
  ]),

  d(1, 'd1-bakery', '面包店', '你早上去面包店买早餐。', [
    ['p', 'Good morning! What would you like?', '早上好！要点什么？'],
    ['y', 'Two croissants, please.', '两个可颂，谢谢。', '要两个可颂'],
    ['p', 'Anything else?', '还要别的吗？'],
    ['y', 'Is the bread fresh today?', '面包是今天的吗？', '问面包新不新鲜'],
    ['p', 'Baked this morning. Still warm.', '今早烤的，还热着呢。'],
    ['y', "I'll take one loaf then.", '那再来一条。', '那就再要一条'],
    ['p', "That's six euros altogether.", '一共六欧。'],
  ]),

  d(1, 'd1-restaurant', '餐厅点餐', '你和朋友刚坐下，服务员走过来。', [
    ['p', 'Are you ready to order?', '可以点单了吗？'],
    ['y', 'Not yet, could you give us a minute?', '还没，能再给我们一分钟吗？', '还没想好，请他等一下'],
    ['p', 'Of course. Can I get you a drink while you wait?', '当然。先来点喝的吗？'],
    ['y', 'Just tap water, please.', '自来水就行，谢谢。', '要一杯自来水'],
    ['p', "Sure. I'll be back in a moment.", '好的，我一会儿回来。'],
    ['y', 'Actually, what do you recommend?', '对了，你推荐什么？', '叫住他，问有什么推荐'],
    ['p', 'The fish is very good today.', '今天的鱼很不错。'],
  ]),

  d(1, 'd1-pharmacy', '药店买药', '你咳嗽好几天了，来药店问问。', [
    ['p', 'Hello, how can I help?', '你好，有什么能帮你的？'],
    ['y', 'I have a cough.', '我咳嗽。', '说你咳嗽'],
    ['p', 'How long have you had it?', '咳多久了？'],
    ['y', 'About three days.', '大概三天。', '说三天左右'],
    ['p', 'Any fever?', '发烧吗？'],
    ['y', 'No, just the cough.', '没有，就是咳嗽。', '说没有，只是咳嗽'],
    ['p', 'Try this syrup. Twice a day, after meals.', '试试这个糖浆。一天两次，饭后吃。'],
    ['y', 'Thanks. How much is it?', '谢谢。多少钱？', '道谢并问价钱'],
  ]),

  d(1, 'd1-bus', '公交问询', '你站在公交站台，不确定这趟车对不对。', [
    ['y', 'Excuse me, does this bus go to the city centre?', '打扰一下，这车去市中心吗？', '问这趟车去不去市中心'],
    ['p', 'No, you want the number 12. It stops across the road.', '不去，你要坐 12 路，在马路对面停。'],
    ['y', 'How often does it come?', '多久一班？', '问多久来一班'],
    ['p', 'Every ten minutes or so.', '大概十分钟一班。'],
    ['y', 'Great, thanks for your help.', '太好了，谢谢你。', '道谢'],
  ]),

  d(1, 'd1-colleague', '同事早上寒暄', '周一早上你刚到办公室，同事走过来。', [
    ['p', 'Morning! How was your weekend?', '早！周末过得怎么样？'],
    ['y', 'Pretty good, thanks. How about yours?', '挺好的，谢谢。你呢？', '说还不错，反问他'],
    ['p', 'Quiet. I just stayed home and slept.', '挺清静的，就在家睡觉。'],
    ['y', 'Sounds nice, actually.', '这样其实挺好。', '说这样其实挺好'],
    ['p', "Coffee? I'm making one.", '要咖啡吗？我正要煮。'],
    ['y', 'Yes, please. That would be great.', '好啊，那太好了。', '接受他的好意'],
  ]),

  d(1, 'd1-return', '商店退货', '你买的衣服不合身，拿回店里。', [
    ['p', 'Hi, what can I do for you?', '你好，需要什么帮助？'],
    ['y', "I'd like to return this. It doesn't fit.", '我想退这个，尺码不合适。', '说你要退货，因为不合身'],
    ['p', 'Do you have the receipt?', '有小票吗？'],
    ['y', 'Yes, here it is.', '有，给你。', '说有，递给他'],
    ['p', 'Would you like a refund or an exchange?', '你想退款还是换货？'],
    ['y', 'A refund, please.', '退款，谢谢。', '说你要退款'],
  ]),

  d(1, 'd1-haircut', '理发店', '你走进理发店，理发师招呼你坐下。', [
    ['p', 'Hi! Take a seat. What are we doing today?', '你好！请坐。今天想怎么剪？'],
    ['y', 'Just a trim, please.', '就修一下，谢谢。', '说只修一下'],
    ['p', 'How short?', '剪多短？'],
    ['y', 'Not too short. Maybe two centimetres.', '别太短，大概两厘米。', '别太短，大概两厘米'],
    ['p', 'And the sides?', '两边呢？'],
    ['y', 'Leave them as they are.', '两边不动。', '说两边保持原样'],
  ]),
];

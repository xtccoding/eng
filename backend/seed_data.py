import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tortoise import Tortoise
from app.models.content import Content
from app.models.typing import TypingSession, TypingResult
from app.models.progress import UserProgress, Achievement, WordProgress
from app.models.export import ExportRecord

PRESET_CONTENTS = [
    # === Listening 听力 ===
    {
        "title": "A Trip to the Museum",
        "content_type": "listening",
        "category": "Daily Life",
        "difficulty": "easy",
        "content_text": "Last Saturday, I visited the National Museum with my family. We took the subway to get there. The museum was very large and had many interesting exhibits. My favorite part was the dinosaur section. The bones were enormous. We spent three hours walking around. After that, we had lunch at a nearby restaurant. I ordered a chicken sandwich and orange juice. It was a wonderful day and I learned a lot of new things.",
        "translation": "上周六，我和家人参观了国家博物馆。我们坐地铁去的。博物馆非常大，有很多有趣的展品。我最喜欢的部分是恐龙展区。那些骨头非常巨大。我们花了三个小时四处参观。之后，我们在附近的一家餐厅吃了午饭。我点了一个鸡肉三明治和橙汁。这是美好的一天，我学到了很多新东西。",
        "tags": ["listening", "daily", "museum"],
        "is_preset": True,
    },
    {
        "title": "Weather Forecast",
        "content_type": "listening",
        "category": "News",
        "difficulty": "easy",
        "content_text": "Good morning, here is your weather forecast for today. In the morning, it will be partly cloudy with temperatures around fifteen degrees Celsius. By noon, the sun will come out and temperatures will rise to twenty-two degrees. In the afternoon, there is a slight chance of rain, so bring an umbrella just in case. The evening will be cool and clear. Perfect weather for a walk in the park. Have a great day, everyone.",
        "translation": "早上好，这是今天的天气预报。早上多云，气温约15摄氏度。中午时分，太阳会出来，气温将升至22度。下午有小雨的可能，所以请带把伞以防万一。晚上会凉爽而晴朗。非常适合在公园散步的天气。祝大家今天愉快。",
        "tags": ["listening", "weather", "news"],
        "is_preset": True,
    },
    {
        "title": "University Lecture: Photosynthesis",
        "content_type": "listening",
        "category": "Academic",
        "difficulty": "hard",
        "content_text": "Today we will discuss photosynthesis, the process by which green plants convert light energy into chemical energy. This process takes place primarily in the leaves, within structures called chloroplasts. Chlorophyll, the green pigment in plants, absorbs sunlight and uses it to transform carbon dioxide and water into glucose and oxygen. The equation is six carbon dioxide plus six water, powered by light energy, produces one glucose and six oxygen molecules. Photosynthesis is fundamental to life on Earth as it produces the oxygen we breathe and forms the base of most food chains.",
        "translation": "今天我们将讨论光合作用，即绿色植物将光能转化为化学能的过程。这个过程主要发生在叶子内部称为叶绿体的结构中。叶绿素是植物中的绿色色素，吸收阳光并利用它将二氧化碳和水转化为葡萄糖和氧气。方程式是六个二氧化碳加六个水，在光能的作用下，产生一个葡萄糖和六个氧分子。光合作用对地球上的生命至关重要，因为它产生我们呼吸的氧气，并构成大多数食物链的基础。",
        "tags": ["listening", "academic", "science"],
        "is_preset": True,
    },

    # === Speaking 口语 ===
    {
        "title": "Self Introduction",
        "content_type": "speaking",
        "category": "Daily Life",
        "difficulty": "easy",
        "content_text": "Hello, my name is Alex. I am twenty-five years old and I come from Beijing. I work as a software engineer at a technology company. In my free time, I enjoy reading books and playing basketball. I am also learning English because I want to travel around the world. My favorite food is noodles, and I love listening to pop music. Nice to meet you all.",
        "translation": "你好，我叫Alex。我25岁，来自北京。我在一家科技公司当软件工程师。业余时间，我喜欢读书和打篮球。我也在学英语，因为我想环游世界。我最喜欢的食物是面条，我喜欢听流行音乐。很高兴认识大家。",
        "tags": ["speaking", "introduction", "daily"],
        "is_preset": True,
    },
    {
        "title": "Describing Your Hometown",
        "content_type": "speaking",
        "category": "Daily Life",
        "difficulty": "medium",
        "content_text": "I would like to tell you about my hometown. It is a medium-sized city located in the south of China. The weather there is warm and humid most of the year. The city is famous for its beautiful parks and delicious street food. There is a large river that runs through the center, and many people enjoy walking along the riverbank in the evening. The people are friendly and the cost of living is reasonable. One thing I love most is the variety of fresh fruits available throughout the year.",
        "translation": "我想告诉你关于我的家乡。它是一个位于中国南方的中等城市。那里一年中大部分时间天气温暖潮湿。这座城市以美丽的公园和美味的街头小吃闻名。有一条大河流经市中心，很多人喜欢傍晚在河岸散步。那里的人很友好，生活成本也很合理。我最喜欢的是全年都有各种各样的新鲜水果。",
        "tags": ["speaking", "hometown", "description"],
        "is_preset": True,
    },
    {
        "title": "Job Interview: Why Should We Hire You",
        "content_type": "speaking",
        "category": "Business",
        "difficulty": "hard",
        "content_text": "Thank you for this opportunity. I believe I am a strong candidate for this position for several reasons. First, I have three years of relevant experience in digital marketing, where I successfully increased social media engagement by forty percent for my previous employer. Second, I am highly adaptable and enjoy learning new skills. Last quarter, I completed a certification in data analytics to better understand consumer behavior. Third, I am a team player who thrives in collaborative environments. I am confident that my combination of experience, dedication, and passion for innovation would make me a valuable addition to your team.",
        "translation": "感谢这个机会。我相信我是这个职位的有力候选人，原因有几个。首先，我在数字营销方面有三年相关经验，成功将前雇主的社交媒体参与度提高了40%。其次，我适应力很强，喜欢学习新技能。上个季度，我完成了数据分析认证，以更好地理解消费者行为。第三，我是团队合作者，在协作环境中表现出色。我相信我的经验、奉献精神和对创新的热情相结合，将使我成为贵团队的宝贵财富。",
        "tags": ["speaking", "interview", "business"],
        "is_preset": True,
    },

    # === Reading 阅读 ===
    {
        "title": "The Benefits of Reading",
        "content_type": "reading",
        "category": "Education",
        "difficulty": "easy",
        "content_text": "Reading is one of the most beneficial habits a person can develop. Studies show that regular reading improves vocabulary, enhances memory, and strengthens analytical thinking skills. When you read a book, your brain is actively processing information, making connections, and building new neural pathways. Reading also reduces stress. A study from the University of Sussex found that just six minutes of reading can reduce stress levels by up to sixty-eight percent. Furthermore, reading exposes you to different perspectives and ideas, helping you become more empathetic and understanding. Whether you prefer fiction or non-fiction, making reading a daily habit will enrich your life in countless ways.",
        "translation": "阅读是一个人能培养的最有益的习惯之一。研究表明，定期阅读可以提高词汇量、增强记忆力并加强分析思维能力。当你读一本书时，你的大脑在积极处理信息、建立联系并构建新的神经通路。阅读还能减轻压力。苏塞克斯大学的一项研究发现，仅仅阅读六分钟就能将压力水平降低多达68%。此外，阅读让你接触到不同的观点和想法，帮助你变得更有同理心和理解力。无论你喜欢小说还是非小说类作品，养成每天阅读的习惯都会在无数方面丰富你的生活。",
        "tags": ["reading", "education", "benefits"],
        "is_preset": True,
    },
    {
        "title": "Space Exploration: Mars Mission",
        "content_type": "reading",
        "category": "Science",
        "difficulty": "medium",
        "content_text": "Humanity's dream of reaching Mars is closer to reality than ever before. Several space agencies and private companies are actively working on missions to send humans to the Red Planet. NASA's Artemis program aims to establish a sustainable presence on the Moon as a stepping stone to Mars. Meanwhile, SpaceX is developing the Starship rocket, designed specifically for interplanetary travel. The journey to Mars takes approximately seven months, and astronauts will face numerous challenges including radiation exposure, muscle atrophy, and psychological isolation. Despite these obstacles, scientists estimate that the first crewed mission to Mars could launch within the next decade, marking a new chapter in human exploration.",
        "translation": "人类到达火星的梦想比以往任何时候都更接近现实。几个航天机构和私人公司正在积极致力于将人类送往这颗红色星球的任务。NASA的阿尔忒弥斯计划旨在在月球上建立可持续的存在，作为前往火星的跳板。与此同时，SpaceX正在开发星舰火箭，专门为星际旅行设计。前往火星的旅程大约需要七个月，宇航员将面临众多挑战，包括辐射暴露、肌肉萎缩和心理隔离。尽管存在这些障碍，科学家估计首次载人火星任务可能在未来十年内发射，标志着人类探索的新篇章。",
        "tags": ["reading", "science", "space", "mars"],
        "is_preset": True,
    },
    {
        "title": "The History of Coffee",
        "content_type": "reading",
        "category": "Culture",
        "difficulty": "easy",
        "content_text": "Coffee is one of the most popular beverages in the world, with over two billion cups consumed every day. The origin of coffee dates back to the fifteenth century in Ethiopia. Legend has it that a goat herder named Kaldi noticed his goats became energetic after eating berries from a certain tree. He tried the berries himself and felt more alert. From Ethiopia, coffee spread to the Arabian Peninsula and then to Europe by the seventeenth century. Today, Brazil is the world's largest coffee producer, followed by Vietnam and Colombia. Coffee culture varies around the world, from Italian espresso bars to American coffee shops to Ethiopian coffee ceremonies.",
        "translation": "咖啡是世界上最受欢迎的饮料之一，每天消费超过20亿杯。咖啡的起源可以追溯到15世纪的埃塞俄比亚。传说一个叫卡尔迪的牧羊人注意到他的山羊吃了某种树上的浆果后变得精力充沛。他自己尝试了浆果，感觉更加清醒。从埃塞俄比亚，咖啡传播到阿拉伯半岛，然后在17世纪传到欧洲。今天，巴西是世界上最大的咖啡生产国，其次是越南和哥伦比亚。世界各地的咖啡文化各不相同，从意大利的浓缩咖啡馆到美国的咖啡店，再到埃塞俄比亚的咖啡仪式。",
        "tags": ["reading", "culture", "history", "coffee"],
        "is_preset": True,
    },

    # === Writing 写作 ===
    {
        "title": "My Daily Routine",
        "content_type": "writing",
        "category": "Daily Life",
        "difficulty": "easy",
        "content_text": "I wake up at seven o'clock every morning. After brushing my teeth and washing my face, I have breakfast. Usually, I eat bread with butter and drink a glass of milk. Then I take the bus to work. The journey takes about thirty minutes. I start work at nine and have lunch at noon. In the afternoon, I continue working until six. After work, I sometimes go to the gym or take a walk in the park. In the evening, I cook dinner and watch television. I go to bed at around eleven.",
        "translation": "我每天早上七点起床。刷牙洗脸后，我吃早餐。通常，我吃涂黄油的面包，喝一杯牛奶。然后我坐公交去上班。路程大约需要三十分钟。我九点开始工作，中午吃午饭。下午，我继续工作到六点。下班后，我有时去健身房或在公园散步。晚上，我做晚饭看电视。我大约十一点上床睡觉。",
        "tags": ["writing", "daily", "routine"],
        "is_preset": True,
    },
    {
        "title": "A Letter to a Friend",
        "content_type": "writing",
        "category": "Letters",
        "difficulty": "medium",
        "content_text": "Dear Tom, how are you? I hope this letter finds you well. It has been a long time since we last met, and I miss our conversations. I wanted to tell you about my new job. I started working at a publishing company last month. The work is challenging but rewarding. My colleagues are very friendly and helpful. I am learning a lot about the publishing industry. In my free time, I have been practicing the guitar. I can now play a few simple songs. Would you like to visit me next month? We could explore the city together. Please write back soon. Best wishes, Sarah.",
        "translation": "亲爱的Tom，你好吗？希望你收到这封信时一切安好。自从我们上次见面已经很久了，我很想念我们的对话。我想告诉你关于我的新工作。我上个月开始在一家出版公司工作。工作很有挑战性但也很有收获。我的同事们非常友好和乐于助人。我正在学习很多关于出版行业的知识。业余时间，我一直在练习吉他。我现在能弹几首简单的曲子了。你下个月想来看我吗？我们可以一起探索这座城市。请尽快回信。祝好，Sarah。",
        "tags": ["writing", "letter", "friend"],
        "is_preset": True,
    },
    {
        "title": "Environmental Protection Essay",
        "content_type": "writing",
        "category": "Essays",
        "difficulty": "hard",
        "content_text": "Environmental protection has become one of the most critical issues of our time. The rapid pace of industrialization has led to severe pollution, deforestation, and loss of biodiversity. Governments around the world must implement stricter regulations on emissions and waste disposal. However, individual responsibility is equally important. Citizens should reduce their carbon footprint by using public transportation, recycling, and conserving energy. Education plays a vital role in raising environmental awareness. Schools should incorporate environmental studies into their curriculum. Furthermore, businesses should adopt sustainable practices and invest in green technologies. Only through collective action can we hope to preserve our planet for future generations.",
        "translation": "环境保护已经成为我们时代最关键的问题之一。快速的工业化进程导致了严重的污染、森林砍伐和生物多样性丧失。各国政府必须对排放和废物处理实施更严格的法规。然而，个人责任同样重要。公民应该通过使用公共交通、回收利用和节约能源来减少碳足迹。教育在提高环保意识方面发挥着至关重要的作用。学校应该将环境研究纳入课程。此外，企业应该采用可持续的做法并投资绿色技术。只有通过集体行动，我们才能希望为子孙后代保护我们的地球。",
        "tags": ["writing", "essay", "environment"],
        "is_preset": True,
    },

    # === Vocabulary 词汇 ===
    {
        "title": "Business English Vocabulary",
        "content_type": "vocabulary",
        "category": "Business",
        "difficulty": "medium",
        "content_text": "negotiate - to discuss something in order to reach an agreement\nrevenue - the money that a company receives from selling goods or services\nstrategy - a plan designed to achieve a particular long-term aim\nstakeholder - a person with an interest or concern in something\ndeadline - the latest time by which something must be completed\nbudget - an estimate of income and expenditure for a set period\nquarter - a period of three months in a company's financial year\ninvestment - the action of investing money for profit\nprofit - the financial gain from a business transaction\ndeficit - the amount by which something falls short\nassets - items of value owned by a company\nliabilities - financial obligations or debts",
        "translation": "negotiate - 谈判，协商\nrevenue - 收入，营收\nstrategy - 战略，策略\nstakeholder - 利益相关者\ndeadline - 截止日期\nbudget - 预算\nquarter - 季度\ninvestment - 投资\nprofit - 利润\ndeficit - 赤字，亏损\nassets - 资产\nliabilities - 负债",
        "tags": ["vocabulary", "business", "professional"],
        "is_preset": True,
    },
    {
        "title": "Academic Writing Words",
        "content_type": "vocabulary",
        "category": "Academic",
        "difficulty": "hard",
        "content_text": "analyze - to examine something in detail\nhypothesis - a proposed explanation for a phenomenon\nmethodology - a system of methods used in a particular area of study\nsignificant - sufficiently great or important\ncorrelation - a mutual relationship between two things\nvariable - a factor that can change in an experiment\nconclusion - the end or finish of an event or process\nimplication - the conclusion that can be drawn from something\nparadigm - a typical example or pattern of something\nframework - a basic structure underlying a system\nperspective - a particular attitude toward something\nphenomenon - a fact or event that can be observed",
        "translation": "analyze - 分析\nhypothesis - 假设\nmethodology - 方法论\nsignificant - 显著的\ncorrelation - 相关性\nvariable - 变量\nconclusion - 结论\nimplication - 含义，影响\nparadigm - 范式\nframework - 框架\nperspective - 视角\nphenomenon - 现象",
        "tags": ["vocabulary", "academic", "writing"],
        "is_preset": True,
    },
    {
        "title": "Travel Vocabulary",
        "content_type": "vocabulary",
        "category": "Travel",
        "difficulty": "easy",
        "content_text": "destination - the place where someone is going\nitinerary - a plan of a journey\naccommodation - a place to stay during travel\nboarding pass - a document that allows you to board a plane\nluggage - bags and suitcases used when traveling\nreservation - an arrangement to have something kept for you\ncurrency - the money used in a particular country\npassport - an official document for international travel\nsouvenir - something you buy to remember a trip\ntourist - a person visiting a place for pleasure\nexcursion - a short journey made for pleasure\ncheck-in - the process of arriving at a hotel or airport",
        "translation": "destination - 目的地\nitinerary - 行程\naccommodation - 住宿\nboarding pass - 登机牌\nluggage - 行李\nreservation - 预订\ncurrency - 货币\npassport - 护照\nsouvenir - 纪念品\ntourist - 游客\nexcursion - 短途旅行\ncheck-in - 登记入住/办理登机",
        "tags": ["vocabulary", "travel", "daily"],
        "is_preset": True,
    },

    # === Speech 演讲稿 (TypingPractice用) ===
    {
        "title": "The Power of Education",
        "content_type": "speech",
        "category": "Education",
        "difficulty": "medium",
        "content_text": "Education is the most powerful weapon which you can use to change the world. It is the passport to the future, for tomorrow belongs to those who prepare for it today. Knowledge is not something you acquire in school and then stop learning. Learning is a lifelong journey. Every experience teaches us something new. Every challenge we face makes us stronger. The beautiful thing about learning is that nobody can take it away from you. Investment in knowledge pays the best interest. So never stop asking questions, never stop exploring, and never stop growing.",
        "translation": "教育是你能用来改变世界的最强大的武器。它是通往未来的护照，因为明天属于今天为之做好准备的人。知识不是你在学校获得然后就停止学习的东西。学习是终身的旅程。每一次经历都教会我们新的东西。我们面对的每一个挑战都让我们更强大。学习的美好之处在于没有人能把它从你身上夺走。知识的投资回报最好。所以永远不要停止提问，永远不要停止探索，永远不要停止成长。",
        "tags": ["speech", "education", "motivation"],
        "is_preset": True,
    },
    {
        "title": "Technology and Society",
        "content_type": "speech",
        "category": "Technology",
        "difficulty": "medium",
        "content_text": "We live in an era of unprecedented technological advancement. Smartphones, artificial intelligence, and the internet have transformed how we work, communicate, and live. But technology is a tool, and like any tool, its value depends on how we use it. We must ensure that technology serves humanity, not the other way around. Digital literacy is no longer optional. It is a fundamental skill for the twenty-first century. As we embrace innovation, we must also protect privacy, promote digital inclusion, and bridge the digital divide. Let us use technology to build a more connected, more equitable world.",
        "translation": "我们生活在一个技术进步前所未有的时代。智能手机、人工智能和互联网改变了我们的工作、交流和生活方式。但技术是一种工具，像任何工具一样，它的价值取决于我们如何使用它。我们必须确保技术服务于人类，而不是相反。数字素养不再是可选的，它是21世纪的基本技能。在我们拥抱创新的同时，我们也必须保护隐私、促进数字包容并弥合数字鸿沟。让我们用技术建设一个更加互联互通、更加公平的世界。",
        "tags": ["speech", "technology", "society"],
        "is_preset": True,
    },

    # === IELTS 雅思 (TypingPractice用) ===
    {
        "title": "IELTS Reading: Urbanization",
        "content_type": "ielts",
        "category": "IELTS",
        "difficulty": "hard",
        "content_text": "Urbanization is one of the most significant global trends of the twenty-first century. Currently, more than fifty-five percent of the world's population lives in urban areas, and this proportion is expected to increase to sixty-eight percent by 2050. This rapid shift presents both opportunities and challenges. Cities are engines of economic growth, generating more than eighty percent of global GDP. However, rapid urbanization can strain infrastructure, increase pollution, and exacerbate social inequality. Sustainable urban planning is essential to ensure that cities remain livable. This includes investing in public transportation, green spaces, affordable housing, and smart city technologies.",
        "translation": "城市化是21世纪最重要的全球趋势之一。目前，世界人口的55%以上生活在城市地区，预计到2050年这一比例将增至68%。这种快速转变既带来机遇也带来挑战。城市是经济增长的引擎，贡献了全球GDP的80%以上。然而，快速城市化可能使基础设施承压、增加污染并加剧社会不平等。可持续的城市规划对于确保城市保持宜居至关重要。这包括投资公共交通、绿色空间、经济适用房和智慧城市技术。",
        "tags": ["ielts", "reading", "urbanization"],
        "is_preset": True,
    },

    # === Article 文章 (TypingPractice用) ===
    {
        "title": "The Future of Artificial Intelligence",
        "content_type": "article",
        "category": "Technology",
        "difficulty": "medium",
        "content_text": "Artificial intelligence is transforming the world in unprecedented ways. From healthcare to transportation, AI systems are becoming integral parts of our daily lives. Machine learning algorithms can now diagnose diseases with remarkable accuracy, often surpassing human doctors in certain areas. Self-driving cars promise to revolutionize transportation, reducing accidents caused by human error. However, with these advances come important ethical questions. How do we ensure AI systems are fair and unbiased? What happens to jobs replaced by automation? These are challenges society must address as we continue to develop this powerful technology.",
        "translation": "人工智能正在以前所未有的方式改变世界。从医疗保健到交通运输，人工智能系统正在成为我们日常生活中不可或缺的一部分。机器学习算法现在能够以惊人的准确性诊断疾病，在某些领域甚至超越了人类医生。自动驾驶汽车有望彻底改变交通运输，减少人为错误造成的事故。然而，随着这些进步，也带来了重要的伦理问题。我们如何确保人工智能系统公平且无偏见？被自动化取代的工作岗位会怎样？这些都是社会在继续开发这项强大技术时必须应对的挑战。",
        "tags": ["article", "AI", "technology"],
        "is_preset": True,
    },
    {
        "title": "Climate Change and Our Planet",
        "content_type": "article",
        "category": "Environment",
        "difficulty": "medium",
        "content_text": "Climate change remains one of the most pressing issues facing humanity today. Global temperatures have risen significantly over the past century, leading to melting ice caps, rising sea levels, and more frequent extreme weather events. Scientists warn that without immediate action, the consequences could be catastrophic. Renewable energy sources such as solar and wind power offer hope for reducing carbon emissions. Many countries have committed to achieving net-zero emissions by 2050. Individual actions also matter. Reducing energy consumption, using public transportation, and supporting sustainable businesses can all contribute to a healthier planet for future generations.",
        "translation": "气候变化仍然是当今人类面临的最紧迫问题之一。过去一个世纪，全球气温显著上升，导致冰盖融化、海平面上升和极端天气事件更加频繁。科学家警告说，如果不立即采取行动，后果可能是灾难性的。太阳能和风能等可再生能源为减少碳排放提供了希望。许多国家已承诺到2050年实现净零排放。个人行动也很重要。减少能源消耗、使用公共交通和支持可持续发展的企业，都可以为子孙后代创造一个更健康的地球做出贡献。",
        "tags": ["article", "climate", "environment"],
        "is_preset": True,
    },
]


async def main():
    await Tortoise.init(
        db_url="sqlite://db.sqlite3",
        modules={"models": ["app.models.content", "app.models.typing", "app.models.progress", "app.models.export"]},
    )
    await Tortoise.generate_schemas()

    for item in PRESET_CONTENTS:
        exists = await Content.filter(title=item["title"]).first()
        if not exists:
            await Content.create(**item)
            print(f"Created: {item['title']}")
        else:
            print(f"Already exists: {item['title']}")

    count = await Content.all().count()
    print(f"\nTotal contents in database: {count}")

    await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(main())
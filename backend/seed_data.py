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
    {
        "title": "The Future of Artificial Intelligence",
        "content_type": "article",
        "category": "Technology",
        "difficulty": "medium",
        "content_text": "Artificial intelligence is transforming the world in unprecedented ways. From healthcare to transportation, AI systems are becoming integral parts of our daily lives. Machine learning algorithms can now diagnose diseases with remarkable accuracy, often surpassing human doctors in certain areas. Self-driving cars promise to revolutionize transportation, reducing accidents caused by human error. However, with these advances come important ethical questions. How do we ensure AI systems are fair and unbiased? What happens to jobs replaced by automation? These are challenges society must address as we continue to develop this powerful technology.",
        "translation": "人工智能正在以前所未有的方式改变世界。从医疗保健到交通运输，人工智能系统正在成为我们日常生活中不可或缺的一部分。机器学习算法现在能够以惊人的准确性诊断疾病，在某些领域甚至超越了人类医生。自动驾驶汽车有望彻底改变交通运输，减少人为错误造成的事故。然而，随着这些进步，也带来了重要的伦理问题。我们如何确保人工智能系统公平且无偏见？被自动化取代的工作岗位会怎样？这些都是社会在继续开发这项强大技术时必须应对的挑战。",
        "tags": ["AI", "technology", "future"],
        "is_preset": True,
    },
    {
        "title": "Climate Change and Our Planet",
        "content_type": "article",
        "category": "Environment",
        "difficulty": "medium",
        "content_text": "Climate change remains one of the most pressing issues facing humanity today. Global temperatures have risen significantly over the past century, leading to melting ice caps, rising sea levels, and more frequent extreme weather events. Scientists warn that without immediate action, the consequences could be catastrophic. Renewable energy sources such as solar and wind power offer hope for reducing carbon emissions. Many countries have committed to achieving net-zero emissions by 2050. Individual actions also matter. Reducing energy consumption, using public transportation, and supporting sustainable businesses can all contribute to a healthier planet for future generations.",
        "translation": "气候变化仍然是当今人类面临的最紧迫问题之一。过去一个世纪，全球气温显著上升，导致冰盖融化、海平面上升和极端天气事件更加频繁。科学家警告说，如果不立即采取行动，后果可能是灾难性的。太阳能和风能等可再生能源为减少碳排放提供了希望。许多国家已承诺到2050年实现净零排放。个人行动也很重要。减少能源消耗、使用公共交通和支持可持续发展的企业，都可以为子孙后代创造一个更健康的地球做出贡献。",
        "tags": ["climate", "environment", "sustainability"],
        "is_preset": True,
    },
    {
        "title": "The Art of Public Speaking",
        "content_type": "speech",
        "category": "Communication",
        "difficulty": "easy",
        "content_text": "Good evening, ladies and gentlemen. Tonight I want to share with you some thoughts about the power of communication. Every great leader in history has been a great communicator. The ability to express your ideas clearly and persuasively is one of the most valuable skills you can develop. Public speaking is not about being perfect. It is about being authentic. When you speak from the heart, people listen. They may not remember every word you say, but they will remember how you made them feel. So I encourage each of you to find your voice and share your story with the world.",
        "translation": "女士们、先生们，晚上好。今晚我想和大家分享一些关于沟通力量的想法。历史上每一位伟大的领袖都是伟大的沟通者。清晰而有说服力地表达自己想法的能力，是你能培养的最有价值的技能之一。公众演讲不是要完美，而是要真实。当你发自内心地说话时，人们会倾听。他们可能不会记住你说的每一个字，但会记住你给他们的感受。所以我鼓励你们每个人找到自己的声音，与世界分享你的故事。",
        "tags": ["speech", "communication", "leadership"],
        "is_preset": True,
    },
    {
        "title": "Essential English Vocabulary - Daily Life",
        "content_type": "vocabulary",
        "category": "Vocabulary",
        "difficulty": "easy",
        "content_text": "accomplish - to achieve or complete something successfully\nacquire - to gain possession of something\nadequate - sufficient for a specific need\nanticipate - to expect or predict something\ncollaborate - to work jointly with others\ncommunicate - to share information effectively\ndemonstrate - to show clearly how something works\ndistinguish - to recognize differences between things\nevolve - to develop gradually over time\nfundamental - forming a necessary base or core\nillustrate - to explain by giving examples\nimplement - to put a plan into action\nindicate - to point out or show\nmaintain - to keep in good condition\nobtain - to get or acquire something",
        "translation": "accomplish - 成功完成某事\nacquire - 获得某物\nadequate - 足够的\nanticipate - 预期或预测\ncollaborate - 与他人合作\ncommunicate - 有效分享信息\ndemonstrate - 清楚展示某事如何运作\ndistinguish - 识别事物之间的差异\nevolve - 逐渐发展\nfundamental - 形成必要基础的\nillustrate - 通过举例解释\nimplement - 将计划付诸行动\nindicate - 指出或显示\nmaintain - 保持良好状态\nobtain - 获取或获得",
        "tags": ["vocabulary", "daily", "basic"],
        "is_preset": True,
    },
    {
        "title": "IELTS Reading - The History of the Internet",
        "content_type": "ielts",
        "category": "IELTS",
        "difficulty": "hard",
        "content_text": "The internet, originally known as ARPANET, was developed in the late 1960s by the United States Department of Defense. Its primary purpose was to create a communication network that could withstand a nuclear attack. The first message was sent between two computers at UCLA and Stanford Research Institute in 1969. Throughout the 1970s and 1980s, the network expanded to include universities and research institutions. The invention of the World Wide Web by Tim Berners-Lee in 1989 revolutionized how people accessed and shared information. By the mid-1990s, the internet had become commercially available to the general public. Today, over five billion people worldwide use the internet, making it one of the most transformative inventions in human history.",
        "translation": "互联网，最初被称为ARPANET，是由美国国防部在20世纪60年代末开发的。其主要目的是创建一个能够承受核攻击的通信网络。第一条消息于1969年在加州大学洛杉矶分校和斯坦福研究所的两台计算机之间发送。在整个20世纪70年代和80年代，网络扩展到包括大学和研究机构。蒂姆·伯纳斯-李在1989年发明的万维网彻底改变了人们访问和共享信息的方式。到20世纪90年代中期，互联网已向公众开放。如今，全球超过50亿人使用互联网，使其成为人类历史上最具变革性的发明之一。",
        "tags": ["ielts", "reading", "history", "internet"],
        "is_preset": True,
    },
    {
        "title": "Healthy Living Habits",
        "content_type": "article",
        "category": "Health",
        "difficulty": "easy",
        "content_text": "Maintaining a healthy lifestyle is essential for both physical and mental well-being. Regular exercise, even just thirty minutes a day, can significantly improve your cardiovascular health and boost your mood. A balanced diet rich in fruits, vegetables, and whole grains provides the nutrients your body needs to function properly. Getting enough sleep, typically seven to nine hours for adults, allows your body to recover and repair itself. Managing stress through meditation, deep breathing, or hobbies can prevent chronic health problems. Remember, small consistent changes often lead to the most lasting results. Start with one healthy habit today.",
        "translation": "保持健康的生活方式对身体和心理健康都至关重要。定期锻炼，即使每天只有三十分钟，也能显著改善心血管健康并提升情绪。富含水果、蔬菜和全谷物的均衡饮食提供了身体正常运作所需的营养。充足的睡眠，成年人通常需要七到九小时，让身体得以恢复和修复。通过冥想、深呼吸或爱好来管理压力，可以预防慢性健康问题。记住，小的持续改变往往带来最持久的效果。今天就开始养成一个健康习惯吧。",
        "tags": ["health", "lifestyle", "wellness"],
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
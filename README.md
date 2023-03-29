# ChatGPT Shortcut

[ChatGPT Shortcut](https://newzone.top/chatgpt/) 是根据领域和功能划分的 ChatGPT 快捷指令表，可通过标签筛选、关键词搜索和一键复制来使用提示词，旨在简化你的工作流程并提高生产力。即使是初学者，你**只需复制提示词，稍加修改后发送给 ChatGPT，就能获得指定输出**，让你的生产力加倍！

提示词（即 Prompt）通常是用户提供的问题或文本，以激活模型生成回复。简单来说，prompt 就是用户想要询问的内容，作为输入送到 ChatGPT 中，ChatGPT 会尝试理解这个输入，然后输出合适的回答或响应。通过优化提示词，可以使 ChatGPT 生成更加准确、有用的回复。ChatGPT Shortcut 页面上的提示词来自网络精选、投稿和 [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)，定期更新。如需自定义提示词，可以参考 ChatGPT Shortcut 和 [ChatGPT Prompt Examples](https://platform.openai.com/examples) 进行调整，同时也欢迎[投稿](https://github.com/rockbenben/ChatGPT-Shortcut/discussions/11)。

开箱即用：<https://newzone.top/chatgpt/>

## 使用说明

ChatGPT Shortcut 页面默认显示全部的提示词，页面分为标签区、搜索区和提示词展示区。

![image](https://user-images.githubusercontent.com/28252913/222007639-20148284-8366-427f-9ee7-ad1be0edbd2e.png)

### 🏷︎ 标签筛选

标签区按提示词的领域和功能进行划分，可根据不同场景和需求进行选择。与标签区右上方的「标签筛选规则切换」按钮配合使用，可进行多标签筛选。默认状态为 OR，即选中标签下的所有提示词。切换到 AND 后，将筛选出具备已选中的多个标签的提示词。

![image](https://user-images.githubusercontent.com/28252913/222007524-c83bcbe9-302e-4c39-be87-0f7ff0bdb2e0.png)

### 🔍 关键词搜索

关键词搜索范围包括提示词的标题、简介、内容和中文翻译。输入关键词后，提示词展示区将立即展示筛选出的内容。如果已选中标签，则关键词搜索仅限于标签筛选范围内。对于 PC 端，搜索框内容变化后，新的搜索结果会在 800 毫秒后显示。移动端则为即时刷新。

![image](https://user-images.githubusercontent.com/28252913/222007492-e4e5428b-3988-4b10-bb48-cdb0b4de882d.png)

### 🔬 展示区复制

通过标签筛选和关键词搜索，点击卡片右上方的「复制」按钮即可获取提示词，将其粘贴到 ChatGPT 中，参考中文提示调整需求文本，即可得到指定领域的回复。如果提示词中的中文备注没有解释清楚，可以点击提示词的绿色标题查看来源网页。

![image](https://user-images.githubusercontent.com/28252913/222007471-e7bec93d-164a-42d2-a019-1b5655bf29fb.png)

### 💬 语言切换

默认情况下，提示词内容会显示为英文。如果你想查看中文释义，可以点击提示词内容将其切换到中文，再次点击即可切回英文。请注意，语言切换只在文字上点击有效，点击空白区域无效。

![中英文切换](http://tc.seoipo.com/chatgptshortcut_encn.gif)

如果想让提示词默认显示为中文，你可以点击导航栏右侧的 `CN` 按钮。需要注意的是，即使切换到中文翻译，复制按钮也仅针对英文提示词复制。下方会有解释原因。

## 🤔 常见问题

### 为什么提示词用英文？

ChatGPT Shortcut 是为方便中文母语人士使用 ChatGPT 而创建的，但是提示词却全部是英文。这是因为相较于中文，ChatGPT 对英文的理解更为出色。即使是国内第一个对话式大型语言模型 MOSS，也承认 MOSS 的英文回答水平比中文高，建议使用英文。（MOSS 已不对外开放）

使用中文提示词可能会得到不错的结果，但是当你再次输入相同的中文提示时，结果可能与之前大相径庭。因为 ChatGPT 对中文的理解每次都不同，所以建议大家在生产力型提示词的输入中使用英文提示词，以保证输出效果。此外，英文提示词带来的回复也很可能是英文的，你可以在提示词结尾添加 `respond in Chinese`，将回复指定为中文。

### 中文搜索出错

搜索功能基于 Docusaurus 的 showcase，存在 PC 端中文输入法焦点丢失问题。向 Docusaurus 反馈后，对方表示会尝试修复和 `FWIW, you should not be using Chinese anyway, since the showcase is not localized`。但问题始终没有解决。

因此，我将搜索组件分为移动端和 PC 端两类。移动端搜索逻辑保持不变，而屏幕宽度阈值 768px 以上的 PC 端浏览引入 `debounce` 函数解决中文输入问题。但这在 PC 端产生两个问题：一是中文输入需在 800 毫秒内完成；二是 PC 端搜索刷新从即时变为 800 毫秒延迟。若你有更好的解决方案，欢迎提供反馈。

### 输出虚假信息

ChatGPT 虽然非常强大，但并不是万能的。有时它会输出虚假信息。例如，当我需要将上百条信息录入到 ChatGPT Shortcut 中时，我让 ChatGPT 按指定格式转换数据。但是在转换过程中，我发现其中一些信息被 ChatGPT 误写。例如，在文本中一条标签是 `movie critic`，而 ChatGPT 将其更改为 `film critic`。尽管这在文本中不会造成什么影响，但放在代码中会报错。因此，在使用 ChatGPT 时，务必检查其输出内容。

### 提示词不好用

所有提示词均来自互联网，会定期进行更新。虽然我测试过每一条提示词，但实际效果可能因需求而有所偏差。如果你发现任何错误、有创意的想法或有好的提示词，欢迎[反馈和投稿](https://github.com/rockbenben/ChatGPT-Shortcut/discussions/11)。

此外，提示词不仅能用于工作生产，更重要的是帮助您开拓思路，发散思维，从多个角度考虑问题，并解决人们在思考时容易忽略的问题。

## Installation

```shell
# Installation
yarn

# Local Development
yarn start

# Build: This command generates static content into the `build` directory
yarn build
```

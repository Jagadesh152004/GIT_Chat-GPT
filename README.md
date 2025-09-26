1 . ABOUT MY PROJECT

 This project is an AI-powered Chat Assistant built with React (frontend) and Node.js + Express (backend), integrated with Azure GPT-4.

 The key innovation is that it is designed with a focus on token optimization – reducing unnecessary token usage when interacting with GPT models. Since API usage is billed based on tokens, this project ensures cost efficiency while maintaining a smooth user experience.

 It provides both chat-based interaction and image-based analysis, giving users flexibility while still optimizing API calls.

 The project is built as a full-stack application with:

* Frontend → React + Tailwind CSS for a clean, responsive chat interface.

* Backend → Node.js + Express for API handling and integration with Azure OpenAI GPT-4.

 It delivers a ChatGPT-like experience while adding unique features such as image-based question answering and customizable explanation levels.

2 . MAIN PURPOSE

The main goal of this project is to provide a smart assistant that can:

* Optimize Azure GPT token usage

  Control response length using levels of explanation -
  Users can choose how detailed they want the AI’s response:

* Answer only (concise result).

* One sentence (short summary).

* Detailed explanation (in-depth reasoning).

  Send only the required content to the API instead of long histories.

  Use structured system + user prompts to reduce token waste.

* Provide a cost-efficient AI assistant

  Users can chat normally, but the backend ensures unnecessary tokens are not consumed.

  Screenshot uploads are processed with minimal but effective instructions.

* Multi-modal support

   Handle text queries (normal chat).

   Handle image uploads (MCQs, problems, diagrams) and give optimized responses.

3 . INTERFACE OVERVIEW

  The user interface is designed for simplicity and usability:

  Chat Layout: Messages appear in a clean, modern chat UI with different styles for user and bot messages.

  Input Box: A textarea that expands as the user types, with support for Enter-to-send.

  Floating Actions (+): Users can open a small dropdown to upload a screenshot.

  Popup Notifications: Temporary alerts for successful uploads or errors.

  Explanation Level Selection: After uploading a screenshot, users choose whether they want a short or detailed response.

  Typing Indicator: Shows “Bot is typing…” while waiting for the AI response.

  Dark Mode Style: Black/gray theme with smooth rounded components for a professional feel.

  ✨ In short:
   This project is a next-gen chat assistant that combines chat + vision AI, providing a multi-modal experience where users can interact with GPT-4 using both text and images, all inside a smooth and modern interface.

   STARTING PAGE 

   ![image alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/99e66a2d13bd5db8a84d5200aed5d803688863db/Screenshot%202025-09-26%20105032.png)

   STARTING NORMAL CHAT WITH CHATGPT_4

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/982c138e6781b4b0d11118ff6be16f5038ba14df/Screenshot%202025-09-26%20105245.png)

   NORMAL ASKING QUERY WITH CHATGPT 4

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/daa3c5b891a9a0da385386175da57f7e2908ba88/Screenshot%202025-09-26%20105521.png)

   UPLOADING SCREENSHOT 

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/09a4bcf430db4e7ef93924675bb862d511299c72/Screenshot%202025-09-26%20120730.png)

   SAMPLE SCREENSHOT

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/fbeac6d69afc34c7d473cc62e227b9fe39b4b76c/Screenshot%202025-09-13%20112117.png)

   CHOOSING THE LEVEL WITH SUCCESSFUL POPUP MESSAGE

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/7929b0f8f508183c2e5a9f8af00adea0a1e5eaa9/Screenshot%202025-09-26%20105738.png)

   FIRTS LEVEL - ONLY ANSWER

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/7d0b9781f0c3c8bc617ef147a6860ca18427cc10/Screenshot%202025-09-26%20110812.png)

   SECOND LEVEL - EXPLAIN IN ONE SENTENCE

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/bb50b9f335f3ee5bf47e651ac7b700202f19a9a8/Screenshot%202025-09-26%20110903.png)

   THIRD LEVEL - EXPLAIN IN MORE DETAIL

   ![image_alt](https://github.com/Jagadesh152004/GIT_Chat-GPT/blob/90a1119e3d71582fd76b5970a3c3b6f53318508d/Screenshot%202025-09-26%20110953.png)

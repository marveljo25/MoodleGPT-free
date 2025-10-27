<p align="center"><a
href="https://www.flaticon.com/free-icons/mortarboard" target="_blank" rel="noopener noreferrer"
title="Mortarboard icons created by itim2101 - Flaticon" ><img src="./extension/icon.png" alt="Mortarboard icons created by itim2101 - Flaticon" width="150" style="display:block; margin:auto;"></a></p>

# MoodleGPT 1.1.5 (Unofficial Clone)

This browser extension allows you to **integrate AI assistance directly into Moodle quizzes**.  
Simply click on a question, and the AI model will automatically generate an answer.  
Please note that, like any AI system, responses may not always be accurate — especially for calculations or subjective questions.

---

## Chrome Web Store

This version is **not published** on the Chrome Web Store.

---

## Credits

The original MoodleGPT project was created by **[Yoann Chb](https://github.com/yoannchb-pro)**.  

This version is an **unofficial modification** designed to **remove the dependency on the paid OpenAI API**, instead using your free/paid model choice — a **Some** supports both **text and image inputs** at no cost.

All credit for the original concept, design, and implementation goes to **Yoann Chb**.

---

## Differences from the Original

- It uses **openrouter API key** instead of OpenAI  
- **Completely free** — for free models  
- Supports **image uploads** for visual models  
- Maintains original MoodleGPT interface and features  

---

## Summary

- [MoodleGPT 1.1.5](#moodlegpt-115)
  - [Chrome Webstore](#chrome-webstore)
  - [Summary](#summary)
  - [Disclaimer !](#disclaimer-)
  - [Donate](#donate)
  - [Update](#update)
  - [Set up](#set-up)
  - [Settings](#settings)
  - [Advanced Settings](#advanced-settings)
  - [Mode](#mode)
  - [Options](#options)
  - [Internal other features](#internal-other-features)
    - [Support table](#support-table)
  - [Supported questions type](#supported-questions-type)
    - [Select](#select)
    - [Put in order question](#put-in-order-question)
    - [Resolve equation](#resolve-equation)
    - [One response (radio button)](#one-response-radio-button)
    - [Multiples responses (checkbox)](#multiples-responses-checkbox)
    - [True or false](#true-or-false)
    - [Number](#number)
    - [Text](#text)
    - [Atto](#atto)
  - [What about if the question can't be autocompleted ?](#what-about-if-the-question-cant-be-autocompleted-)
  - [Test](#test)
  - [Beta version with advanced features](#beta-version-with-advanced-features)

## Disclaimer !

I hereby declare that I am not responsible for any misuse or illegal activities carried out using my program. The code is provided for educational and research purposes only, and any use of it outside of these purposes is at the user's own risk.

## Donate

Will be a pleasure if you want to support this clone project :). I'm alone working on this project and I'm still a high schooler
<br/>
<a href="https://buymeacoffee.com/marveljo" target="_blank" rel="noopener noreferrer"><img src="./assets/bmc-button.png" alt="Mortarboard icons created by itim2101 - Flaticon" width="150"></a>

## Update

See the [changelog](./CHANGELOG.md) to see every updates !

## Set up

> NOTE: This extension only works on Chromium-based browsers like Edge, Chrome, etc.

<p align="center">
<img src="./assets/setup.png" alt="Popup" width="300">
</p>

Go to <b>"Manage my extensions"</b> on your browser, then click on <b>"Load unpacked extension"</b> and select the <b>"extension"</b> folder. Afterwards, click on the extension icon and enter the ApiKey obtained from [openrouter API](https://openrouter.ai/settings/keys).

## Settings

- <b>API KEY\*</b>: Your OPEN-ROUTER api key
- <b>**MODEL\*</b>: Your model name in the format `<provider>/<model>[:variant]`  
  - Example: `qwen/qwen2.5-vl-32b-instruct:free`  
  - Structure:  
    - `<provider>` → organization or developer (e.g., `qwen`, `google`, `meta-llama`)  
    - `<model>` → model identifier (e.g., `qwen2.5-vl-32b-instruct`)  
    - `[:variant]` → optional tag such as `:free` for free-tier models  

## Advanced Settings

- <b>CODE</b>: A code you will need to type on your keyboard to inject/remove the extension code from the moodle page. It allow you to be more discret and control the injection so it's recommended.
- <b>BASE URL</b>: The API endpoint if you need to use your own llm, make sure using {baseURL}/api/v1/chat/completions
- <b>MAX TOKENS</b>: The max tokens length you want the api to respond with.

## Mode

<p align="center">
<img src="./assets/mode.png" alt="Popup" width="300">
</p>

- <b>Autocomplete:</b> The extension will complete the question for you by selecting the correct(s) answer(s).
- <b>Clipboard:</b> The response is copied into the clipboard.
- <b>Question to answer:</b> The question is converted to the answer and you can click on it to show back the question (or show back the answer).
  <br/><img src="./assets/question-to-answer.gif" alt="Question to Answer">

## Options

<p align="center">
<img src="./assets/settings.png" alt="Popup" width="300">
</p>

- <b>Api key\*</b>: the [open-router api key](https://openrouter.ai/settings/keys) from your account.
- <b>Code</b>: a code to be more discret for injecting/removing the extension from the page. Simply type your code you entered into the configuration on the keyboard when you are on your moodle quiz and the extension will be inject. If you want to remove the injection just simply type back the code on your keyboard.
- <b>Cursor indication</b>: show a pointer cursor and a hourglass to know when the request is finished.
- <b>Title indication</b>: show some informations into the title to know for example if the code have been injected.
  <br/> ![Injected](./assets/title-injected.png)
- <b>Console logs</b>: show logs into the console for the question, chatgpt answer and which response has been chosen.
  <br/><img src="./assets/logs.png" alt="Logs" width="250">
- <b>Request timeout</b>: if the request is too long it will be abort after 20 seconds.
- <b>Typing effect</b>: create a typing effect for text. Type any text and it will be replaced by the correct one. If you want to stop it press <b>Backspace</b> key.
  <br/> ![Typing](./assets/typing.gif)
- <b>Mouseover effect</b>: you will need to hover (or click for select) the question response to complete it automaticaly.
  <br/> ![Mouseover](./assets/mouseover.gif)
  <br/> ![Mouseover2](./assets/mouseover2.gif)
- <b>Infinite try</b>: click as much as you want on the question (don't forget to reset the question).
- <b>Save history</b>: allows you to create a conversation with ChatGPT by saving the previous question with its answer. However, note that it can consume a significant number of tokens.
- <b>Include images</b> Works if using vision models
  <br/> ![Images](./assets/images.gif)

## Internal other features

### Support table

Table are formated from the question to make it more readable for CHAT-GPT. Example of formatted table output:

```
id       | name  | birthDate  | cars
------------------------------------
Person 1 | Yvick | 15/08/1999 | yes 
Person 2 | Yann  | 19/01/2000 | no
```

![Table](./assets/table.gif)

## Supported questions type

### Select

![Select](./assets/select.gif)

### Put in order question

![Order](./assets/order.gif)

### Resolve equation

![Equations](./assets/equations.gif)

### One response (radio button)

![Radio](./assets/radio.gif)

### Multiples responses (checkbox)

![Checkbox](./assets/checkbox.gif)

### True or false

![True-false](./assets/true-false.gif)

### Number

![Number](./assets/number.gif)

### Text

![Text](./assets/text.gif)

### Atto

![Atto](./assets/atto.gif)

## What about if the question can't be autocompleted ?

To know if the answer has been copied to the clipboard, you can look at the title of the page which will become <b>"Copied to clipboard"</b> for 3 seconds if `Title indication` is on.

![Clipboard](./assets/clipboard.gif)

## Test

- <b>Solution 1</b>: Go on this [moodle demo page](https://moodle.org/demo).
- <b>Solution 2</b>: Run the `index.html` file located in the `test/fake-moodle` folder.

## Beta version with advanced features

This version is a modified clone of the original [MoodleGPT](https://github.com/yoannchb-pro/MoodleGPT) project.  
It does not include the official **dev branch** or beta updates from the original repository.  
Any additional features or changes in this version are independently maintained.

---

## Credits

- **Original project:** [MoodleGPT by Yoann Chb](https://github.com/yoannchb-pro/MoodleGPT)  
- **Icons:** [Mortarboard icons created by itim2101 - Flaticon](https://www.flaticon.com/free-icons/mortarboard)  
- **Inspiration:** Integrating AI with Moodle quizzes for educational purposes/~~and cheating~~
- **Contributors:** Me
- **Special thanks:** OpenAI and the open-source community for the technologies enabling this project.

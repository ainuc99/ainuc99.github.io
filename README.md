# 云固件官方网站

云固件官方网站，分成首页、免费镜像、教程三个栏目。博客文章通过另外的项目自动生成，嵌入为二级目录。


## 首页

首页分成拿来主义、支持系统、免费镜像、使用场景、教程、云固件快优几个部分。


## 镜像仓库

提供Windows 7 ~ 11 5个企业版，其中10/11使用LTSC版本。

Linux提供CentOS Steam、Debian 13、Ubuntu 24.04 LTS、Manjora KDE四个版本，分成代表了RedHat系、Debian系、Arch系这三个主要Linux发行版本。

国产系统提供银河麒麟V10 SP1 2303版本。


## 教程

教程分成初级教程、中级教程、高级教程三大部分，已经开始使用的两篇保姆级别教程。

后两篇教程，对应了开始使用页面。

## 使用说明

本网站内容页使用PostHTML生成。

安装PostHTML

```
# 初始化
npm init -y

# 安装核心工具（如果之前装过可跳过）
npm install -D posthtml-cli posthtml-include
```


自动生成静态页面

```
npm run watch
```
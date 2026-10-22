#!/bin/bash
# 移植自 q30p 仓库 2410-6.6-diy-part2-6-1-pw.sh（网段/主机名/镜像名定制）
# 执行时机：feeds 安装后、make 之前

# 1. 默认 LAN IP：192.168.1.1 -> 192.168.6.1
sed -i 's/192.168.1.1/192.168.6.1/g' package/base-files/files/bin/config_generate

# 2. 主机名：保持官方大小写 ImmortalWrt（不加日期后缀）
#    config_generate 默认即 ImmortalWrt，无需改动

# 3. 镜像文件名：加日期前缀 24.10-6.6-
sed -i 's|IMG_PREFIX:=|IMG_PREFIX:=$(shell TZ="Asia/Shanghai" date +"%Y%m%d")-24.10-6.6-|' include/image.mk

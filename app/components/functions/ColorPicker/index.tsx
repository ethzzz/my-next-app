'use client'
import { createFromIconfontCN } from "@ant-design/icons";
import { FunctionItem, FunctionItemHeader, FunctionItemContent } from "../../function-item";
import { ColorPickerPanel } from "./ColorPickerPanel";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js", // 在 iconfont.cn 上生成
})

export function ColorPicker(){
  return (
        <FunctionItem>
          <FunctionItemHeader>
            颜色选择器
          </FunctionItemHeader>
          <FunctionItemContent>
            <ColorPickerPanel value="rgb(0 0 0)"/>
          </FunctionItemContent>
        </FunctionItem>
      )
}

ColorPicker.displayName = "ColorPicker"
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 集中管理模型和API Key
const AI_MODELS = [
  {
    label: 'GPT-3.5',
    value: 'gpt-3.5',
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
  },
  {
    label: 'GPT-4',
    value: 'gpt-4',
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
  },
  {
    label: '文心一言',
    value: 'wenxin',
    provider: 'wenxin',
    apiKey: process.env.WENXIN_API_KEY,
    apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    model: 'ERNIE-Bot',
  },
];

// GET: 返回所有支持的模型
export async function GET() {
  return NextResponse.json({ models: AI_MODELS.map(({ apiKey, apiUrl, ...rest }) => rest) });
}

// POST: 聊天
export async function POST(request: NextRequest) {
  try {
    const { input, model = 'gpt-3.5' } = await request.json();
    if (!input) {
      return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 });
    }
    const modelInfo = AI_MODELS.find(m => m.value === model);
    if (!modelInfo) {
      return NextResponse.json({ error: '不支持的模型' }, { status: 400 });
    }
    if (!modelInfo.apiKey) {
      return NextResponse.json({ error: `未配置${modelInfo.label}的API Key` }, { status: 500 });
    }
    let aiReply = '';
    if (modelInfo.provider === 'openai') {
      // OpenAI
      const openaiRes = await fetch(modelInfo.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelInfo.apiKey}`,
        },
        body: JSON.stringify({
          model: modelInfo.model,
          messages: [
            { role: 'user', content: input },
          ],
          temperature: 0.7,
        }),
      });
      if (!openaiRes.ok) {
        const err = await openaiRes.text();
        return NextResponse.json({ error: 'OpenAI请求失败', detail: err }, { status: 500 });
      }
      const data = await openaiRes.json();
      aiReply = data.choices?.[0]?.message?.content || 'AI无回复';
    } else if (modelInfo.provider === 'wenxin') {
      // 文心一言
      // 需先获取access_token
      const tokenRes = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${modelInfo.apiKey}&client_secret=${process.env.WENXIN_SECRET_KEY}`);
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return NextResponse.json({ error: '文心一言token获取失败', detail: tokenData }, { status: 500 });
      }
      const wenxinRes = await fetch(`${modelInfo.apiUrl}?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: input },
          ],
        }),
      });
      if (!wenxinRes.ok) {
        const err = await wenxinRes.text();
        return NextResponse.json({ error: '文心一言请求失败', detail: err }, { status: 500 });
      }
      const data = await wenxinRes.json();
      aiReply = data.result || 'AI无回复';
    } else {
      return NextResponse.json({ error: '未知模型类型' }, { status: 400 });
    }
    return NextResponse.json({ reply: aiReply });
  } catch (e) {
    return NextResponse.json({ error: '服务异常', detail: String(e) }, { status: 500 });
  }
} 
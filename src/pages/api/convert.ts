import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const template = `Please give me the latex for this equation (I copied it from a pdf)

{text}

Only give me the latex in '$'. No other words.`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

const convertToLatex = async (text: string) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: template.replace("{text}", text),
      },
    ],
  });

  return response.data.choices[0].message?.content;
};

type Data = {
  latex: string | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { text } = req.body;

  let latex;

  try {
    latex = await convertToLatex(text);
  } catch (error) {
    console.error(error);
    latex =
      "Sorry, we've experienced more demand than we anticipated. Check back later to see if the demo is working.";
  }

  res.status(200).json({ latex });
}

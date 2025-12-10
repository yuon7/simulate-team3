"use client";

import { useState } from "react";
import { Card, Textarea, Button, Text, Loader, Stack, Group, Avatar } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";

//ダミー回答リスト
const DUMMY_ANSWERS = [
  "ご質問ありがとうございます！\nその地域は最近、子育て支援に力を入れており、移住者向けの補助金制度も充実していますよ。",
  "なるほど、生活費ですね。\n地方移住した場合、家賃は平均して都市部の50%〜70%程度に抑えられる傾向があります。車の維持費はかかりますが、トータルでは安くなることが多いです。",
  "現地のコミュニティについてですね。\n移住者交流会が月に1回開催されており、初めての方でも馴染みやすい雰囲気があります。最初は不安かもしれませんが、サポート窓口も充実しています。",
  "その条件であれば、長野県の松本市や、福井県の福井市などが候補に挙がるかもしれません。\n自然が豊かで、かつ生活の利便性も高いエリアです。",
];

export default function LifeChatAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(""); // 前の回答をクリア

    //1.5秒待ってからダミー回答を表示する
    setTimeout(() => {
      // ランダムに回答を選んで返す
      const randomAnswer = DUMMY_ANSWERS[Math.floor(Math.random() * DUMMY_ANSWERS.length)];
      
      setAnswer(randomAnswer);
      setLoading(false);
    }, 1500); 
  };

  return (
    <Card withBorder padding="lg" radius="md">
      <Group mb="md">
        <IconRobot size={24} />
        <Text fw={700}>暮らし相談AI（デモ版）</Text>
      </Group>
      
      <Textarea
        label="移住に関する質問を入力"
        placeholder="例：福岡に移住した場合の生活費を教えて"
        minRows={3}
        value={question}
        onChange={(e) => setQuestion(e.currentTarget.value)}
        disabled={loading}
      />

      <Button
        mt="md"
        onClick={handleSend}
        loading={loading}
        disabled={!question.trim()}
      >
        回答を取得する
      </Button>

      {answer && (
        <Card mt="lg" padding="md" radius="md" bg="gray.0" withBorder>
          <Group align="flex-start">
            <Avatar color="blue" radius="xl"><IconRobot size="1.2rem" /></Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={700} mb={4}>AIアドバイザー</Text>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {answer}
              </Text>
            </div>
          </Group>
        </Card>
      )}
    </Card>
  );
}
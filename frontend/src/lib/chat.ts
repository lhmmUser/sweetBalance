export async function sendChat(prompt:string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body:JSON.stringify({prompt}),
    });
    const data = await res.json();
    return data.reply;
 }
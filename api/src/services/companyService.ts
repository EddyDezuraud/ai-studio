const getCompanyDescription = async (companyName: string): Promise<string> => {
    
    const AWANLLM_API_KEY = '';

    const res = await fetch("https://api.awanllm.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${AWANLLM_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "Meta-Llama-3-8B-Instruct",
            "messages": [
            {"role": "user", "content": `Give me a short description of the company ${companyName} in only one sentence.`},
            ],
        })
    });

    const data = await res.json();
    return data?.choices[0]?.message?.content;
}

export { getCompanyDescription };
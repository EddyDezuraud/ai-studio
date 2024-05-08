import * as cheerio from 'cheerio';
import axios from 'axios';

import { getUserAgent } from '../helpers/utils';

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
};


const getWebsite = async (companyName: string): Promise<string> => {
    // Use cheerio to search google results with query "companyName"
    const query = `${companyName} site officiel`;
    const searchUrl = `https://www.google.com/search?q=${query}`;

    const response = await axios.get(searchUrl, {
        headers: {
            'User-Agent': getUserAgent()
        }
    });

    const $ = cheerio.load(response.data);
    const url = $('.yuRUbf a').first().attr('href');

    console.log(url);

    return url ? url : '';    
}

export { getCompanyDescription, getWebsite };
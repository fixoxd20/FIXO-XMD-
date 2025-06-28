const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "fbdl",
    alias: ["fb", "facebook"],
    desc: "Download Facebook videos",
    category: "media",
    filename: __filename
},
async(robin, mek, m, {from, q, sender, reply}) => {
    try {
        if (!q) return reply("Please provide a Facebook URL");
        
        // Validate Facebook URL
        const fbRegex = /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/.+/i;
        if (!fbRegex.test(q)) return reply("❌ Invalid Facebook URL");

        await reply("📥 Processing Facebook video...");

        // Newsletter context info
        const _0x273817 = {
            'mentionedJid': [sender],
            'forwardingScore': 0x3e7,
            'isForwarded': true,
            'forwardedNewsletterMessageInfo': {
                'newsletterJid': '120363292876277898@newsletter',
                'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                'serverMessageId': 0x8f
            }
        };

        const apiUrl = `https://suhas-bro-api.vercel.app/download/fbdown?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.result) {
            return reply("❌ Failed to fetch video. Invalid URL or API error.");
        }

        const { thumb, title, desc, sd, hd } = response.data.result;
        const videoUrl = hd || sd;

        // Prepare info message
        const infoMessage = `
╔══════════════════╗
   📱 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗩𝗜𝗗𝗘𝗢
╚══════════════════╝

📌 𝗧𝗜𝗧𝗟𝗘: ${title || "No title available"}
📝 𝗗𝗘𝗦𝗖: ${desc || "No description available"}

🔗 𝗦𝗢𝗨𝗥𝗖𝗘 𝗨𝗥𝗟: ${q}

╔══════════════════╗
  ✦ 𝗙𝗜𝗫𝗢 𝗫𝗠𝗗 ✦
╚══════════════════╝
        `.trim();

        // Send thumbnail with info (with newsletter context)
        await robin.sendMessage(
            from,
            {
                image: { url: thumb },
                caption: infoMessage,
                contextInfo: _0x273817
            },
            { quoted: mek }
        );

        // Send video file (with newsletter context)
        await robin.sendMessage(
            from,
            {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: `📥 ${title || "Facebook Video"}\n\n⚡ Powered by 𝐅𝐈𝐗𝐎 𝐗𝗠𝗗`,
                fileName: `facebook_video_${Date.now()}.mp4`,
                contextInfo: _0x273817
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("Facebook DL Error:", error);
        reply("❌ Error downloading video. Please check the URL and try again.");
    }
});
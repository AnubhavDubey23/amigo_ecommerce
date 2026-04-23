const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const oldBlockRegex = /<div class="header-right">[\s\S]*?<\/div>/;

const newBlock = `<div class="header-right">
                    <img src="img/icons/search.png" alt="Search" class="search-trigger" style="cursor: pointer;">
                    <a href="login.html" id="user-profile-link">
                        <img src="img/icons/man.png" alt="User">
                    </a>
                    <a href="shopping-cart.html">
                        <img src="img/icons/bag.png" alt="Cart">
                        <span>0</span>
                    </a>
                </div>`;

for (const file of files) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (oldBlockRegex.test(content)) {
        content = content.replace(oldBlockRegex, newBlock);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}

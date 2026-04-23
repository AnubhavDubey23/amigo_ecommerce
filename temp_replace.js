const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'product-page.html');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<script>\s*document\.getElementById\('add-to-cart-btn'\)\.addEventListener\('click'[\s\S]*?<\/html>/;

const newScript = `<script>
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch('/api/products/' + productId)
                .then(res => res.json())
                .then(product => {
                    if (product.error) {
                        alert('Product not found');
                        return;
                    }
                    // Dynamically update DOM
                    $('.product-content h2').text(product.name);
                    $('.pc-meta h5').text('$' + product.price.toFixed(2));
                    $('.tags li:first-child').html('<span>Category :</span> ' + (product.category || 'Luxury'));
                    
                    // Replace owl carousel items
                    const newHtml = \`
                        <div class="product-img">
                            <figure>
                                <img src="\${product.image_url}" alt="\${product.name}">
                                <div class="p-status">new</div>
                            </figure>
                        </div>
                    \`;
                    // Wait for owl carousel to be ready then replace content
                    setTimeout(() => {
                        $('.product-slider').trigger('replace.owl.carousel', newHtml).trigger('refresh.owl.carousel');
                    }, 100);
                })
                .catch(err => console.error('Error fetching product:', err));
        }

        document.getElementById('add-to-cart-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('amigo_token');
            if (!token) {
                alert('Please sign in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }
            
            // Default to product 1 if no dynamic ID is passed, for fallback testing
            const targetProductId = productId || 1; 
            const quantity = parseInt(document.getElementById('qty-input').value) || 1;
            
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: window.getAuthHeaders(),
                    body: JSON.stringify({ product_id: targetProductId, quantity, size: 'M' })
                });
                
                if (res.ok) {
                    alert('Added to cart!');
                    window.updateCartCounter();
                } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to add to cart');
                }
            } catch (err) {
                alert('Server connection failed');
            }
        });
    </script>
</body>
</html>`;

if (regex.test(content)) {
    content = content.replace(regex, newScript);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated product-page.html');
} else {
    console.log('Regex did not match.');
}

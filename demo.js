document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wms-form');
    const inventoryBody = document.getElementById('inventoryBody');

    // Inicjalizacja danych z Storage z domyślnymi wartościami
    let inventory = JSON.parse(localStorage.getItem('wms_inventory')) || [
        { sku: 'WMS-001', name: 'Paleta Drewniana', qty: 50, category: 'Nośniki' },
        { sku: 'WMS-002', name: 'Karton Zbiorczy A4', qty: 120, category: 'Opakowania' }
    ];

    // Funkcja aktualizująca statystyki na dashboardzie
    const updateStats = () => {
        const totalItems = document.getElementById('total-items');
        const totalQty = document.getElementById('total-qty');
        const lowStock = document.getElementById('low-stock-count');

        if (totalItems) totalItems.innerText = inventory.length;
        if (totalQty) totalQty.innerText = inventory.reduce((sum, item) => sum + item.qty, 0);
        if (lowStock) lowStock.innerText = inventory.filter(i => i.qty < 10).length;
    };

    // Funkcja powiadomień
    const showNotify = (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // Renderowanie tabeli
    function renderTable() {
        if (!inventoryBody) return;
        inventoryBody.innerHTML = '';
        
        inventory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            row.innerHTML = `
                <td><span class="sku-badge">${item.sku}</span></td>
                <td>
                    <div class="product-info">
                        <strong>${item.name}</strong>
                        <small>${item.category || 'Ogólne'}</small>
                    </div>
                </td>
                <td>
                    <div class="qty-control">
                        <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                        <span class="qty-badge ${item.qty < 10 ? 'low-stock' : ''}">${item.qty} szt.</span>
                        <button class="btn-qty" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td>
                    <button class="btn-out" onclick="removeItem(${index})">USUŃ</button>
                </td>
            `;
            inventoryBody.appendChild(row);
        });
        
        localStorage.setItem('wms_inventory', JSON.stringify(inventory));
        updateStats();
    }

    // Zmiana ilości
    window.changeQty = (index, change) => {
        if (inventory[index].qty + change >= 0) {
            inventory[index].qty += change;
            renderTable();
        } else {
            showNotify('Brak towaru na stanie!', 'error');
        }
    };

    // Dodawanie nowego towaru
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const skuInput = document.getElementById('itemSku');
            const nameInput = document.getElementById('itemName');
            const qtyInput = document.getElementById('itemQty');
            const catInput = document.getElementById('itemCategory');

            if (inventory.some(i => i.sku === skuInput.value)) {
                showNotify('To SKU już istnieje!', 'error');
                return;
            }

            const newItem = {
                sku: skuInput.value,
                name: nameInput.value,
                qty: parseInt(qtyInput.value),
                category: catInput ? catInput.value : 'Ogólne'
            };

            inventory.push(newItem);
            renderTable();
            form.reset();
            showNotify('Towar dodany pomyślnie!');
        });
    }

    // Usuwanie towaru
    window.removeItem = (index) => {
        if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            inventory.splice(index, 1);
            renderTable();
            showNotify('Produkt usunięty.', 'error');
        }
    };

    renderTable();
});
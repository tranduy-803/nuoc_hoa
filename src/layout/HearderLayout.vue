<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import logoImg from '../img/logo.png'

const isOrderMenuOpen = ref(false) // Biến trạng thái đóng/mở menu đơn hàng
const isProductMenuOpen = ref(false) // Biến trạng thái đóng/mở menu sản phẩm
const isCustomerMenuOpen = ref(false) // Biến trạng thái đóng/mở menu khách hàng
const isPromotionMenuOpen = ref(false) // Biến trạng thái đóng/mở menu khuyến mãi
</script>

<template>
  <div class="mobile-world-sidebar">
    <div class="logo">
      <img :src="logoImg" alt="Chanel Logo" class="logo-img" />
      <h2>HINDUY</h2>
    </div>

    <nav>
      <div class="menu-category">
        <RouterLink to="/home" class="menu-item" active-class="active">
          <span class="checkbox">📊</span> Dashboard
        </RouterLink>
        <div class="menu-header clickable" @click="isOrderMenuOpen = !isOrderMenuOpen">
          📦 Quản lý đơn hàng
        </div>

        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isOrderMenuOpen" class="submenu">
          <RouterLink to="/donHang" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">📋</span> Đơn hàng
          </RouterLink>
        </div>
        <div v-if="isOrderMenuOpen" class="submenu">
          <RouterLink to="/hoaDon" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">🧾</span> Hóa đơn
          </RouterLink>
        </div>
        <div class="menu-header clickable" @click="isProductMenuOpen = !isProductMenuOpen">
          🛍️ Quản lý sản phẩm
        </div>

        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isProductMenuOpen" class="submenu">
          <RouterLink to="/product" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">📦</span> Sản phẩm
          </RouterLink>
        </div>
        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isProductMenuOpen" class="submenu">
          <RouterLink to="/category" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">📂</span> Danh mục
          </RouterLink>
        </div>
        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isProductMenuOpen" class="submenu">
          <RouterLink to="/brands" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">🏷️</span> Thương hiệu
          </RouterLink>
        </div>

        <div class="menu-header clickable" @click="isCustomerMenuOpen = !isCustomerMenuOpen">
          👥 Quản lý Khách hàng
        </div>

        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isCustomerMenuOpen" class="submenu">
          <RouterLink to="/customer" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">👤</span> Khách hàng
          </RouterLink>
        </div>
        <div v-if="isCustomerMenuOpen" class="submenu">
          <RouterLink to="/review" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">⭐</span> Đánh giá/Phản hồi
          </RouterLink>
        </div>

        <div class="menu-header clickable" @click="isPromotionMenuOpen = !isPromotionMenuOpen">
          🎁 Quản lý khuyến mãi
        </div>

        <!-- Thêm v-if để điều khiển hiển thị -->
        <div v-if="isPromotionMenuOpen" class="submenu">
          <RouterLink to="/promotion" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">🎯</span> Chương trình khuyến mãi
          </RouterLink>
        </div>
        <div v-if="isPromotionMenuOpen" class="submenu">
          <RouterLink to="/coupon" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">🎫</span> Mã giảm giá
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.mobile-world-sidebar {
  width: 300px;
  background: linear-gradient(135deg, #190a1a 0%, #3c0964 100%);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 2px solid #d4af37;
  padding: 10px;
  overflow-y: auto;
}

.logo {
  /* padding: 5px 10px; */
  margin-right: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  /* border-bottom: 1px solid #ddd; */
}

.logo-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.logo h2 {
  color: #d4af37;
  margin: 0;
  padding-right: 25px;
  font-size: 1.5rem;
  text-shadow: 0 2px 4px rgba(212, 175, 55, 0.5);
}

.menu-category {
  margin-bottom: 15px;
}

.menu-header {
  font-weight: bold;
  color: #d4af37;
  padding: 12px 15px;
  margin-bottom: 5px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-left: 10px;
  border: 1px solid transparent;
  position: relative;
}

.menu-header::after {
  content: '▼';
  font-size: 12px;
  transition: transform 0.3s ease;
}

.menu-header.clickable:hover {
  background-color: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  transform: translateX(5px);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background-color: #3c0964;
}

.submenu {
  padding-left: 20px;
  animation: slideDown 0.3s ease-out;
  overflow: hidden;
}

.submenu-item {
  margin-left: 10px;
  transform: translateX(-10px);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-10px);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #d4af37;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: all 0.2s;
  font-size: 18px;
  font-weight: bold;
}

.menu-item:hover {
  background-color: #3c0964;
  color: #d4af37;
}

.menu-item.active {
  background-color: rgba(212, 175, 55, 0.3);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.5);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.checkbox {
  margin-right: 10px;
  font-family: monospace;
  font-size: 0.9em;
}

.arrow {
  font-size: 0.8em;
  margin-left: 5px;
}
</style>

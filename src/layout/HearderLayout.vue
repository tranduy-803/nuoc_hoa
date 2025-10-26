<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import logoImg from '../img/logo.png'
import { authService } from '../services/authService'

const isOrderMenuOpen = ref(false) // Biến trạng thái đóng/mở menu đơn hàng
const isProductMenuOpen = ref(false) // Biến trạng thái đóng/mở menu sản phẩm
const isCustomerMenuOpen = ref(false) // Biến trạng thái đóng/mở menu khách hàng
const isPromotionMenuOpen = ref(false) // Biến trạng thái đóng/mở menu khuyến mãi
const showMenu = ref(false) // Biến trạng thái đóng/mở menu dropdown

// User info
const currentUser = computed(() => authService.getCurrentUser())
const isAdmin = computed(() => authService.isAdmin())
const isStaff = computed(() => authService.isStaff())

// Logout function
const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    authService.logout()
  }
}

// Toggle menu function
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Open menus on mount
onMounted(() => {
  isProductMenuOpen.value = true
})
</script>

<template>
  <!-- Fixed Header Section - Full Width -->
  <div v-if="currentUser" class="fixed-header-full">
    <div class="header-content">
      <div v-if="currentUser" class="user-section-top">
        <div class="user-info">
          <div class="user-avatar">{{ currentUser.username.charAt(0).toUpperCase() }}</div>
          <div class="user-details">
            <div class="user-name">{{ currentUser.fullName || currentUser.username }}</div>
            <div class="user-role" :class="{ 'role-admin': isAdmin, 'role-staff': isStaff }">
              {{ currentUser.role }}
            </div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <button class="menu-toggle-btn" @click="toggleMenu">☰</button>
        <div v-if="showMenu" class="menu-dropdown">
          <RouterLink to="/home" class="menu-dropdown-item" @click="toggleMenu">
            🏠 Trang chủ
          </RouterLink>
          <button class="menu-dropdown-item" @click="handleLogout">🚪 Đăng xuất</button>
        </div>
      </div>
    </div>
  </div>

  <div class="mobile-world-sidebar">
    <!-- User Info Section at Top -->

    <div class="logo">
      <img :src="logoImg" alt="Chanel Logo" class="logo-img" />
      <h2>HINDUY</h2>
    </div>

    <nav style="flex: 1; overflow-y: auto">
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

        <!-- Quản lý hệ thống - Chỉ ADMIN mới thấy -->
        <div v-if="isAdmin" class="menu-header clickable" @click="isUserMenuOpen = !isUserMenuOpen">
          ⚙️ Quản lý hệ thống
        </div>

        <div v-if="isAdmin && isUserMenuOpen" class="submenu">
          <RouterLink to="/users" class="menu-item submenu-item" active-class="active">
            <span class="checkbox">👤</span> Tài khoản
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Fixed Header Section - Content Area Only */
.fixed-header-full {
  position: fixed;
  top: 0;
  left: 330px;
  right: 10px;
  height: 60px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  z-index: 10001;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  padding: 6px 20px 0 20px;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-right: 40px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding-bottom: 8px;
}

/* User Section in Header */
.fixed-header-full .user-section-top {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
}

.fixed-header-full .user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #495057;
}

.fixed-header-full .user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: #190a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #d4af37;
}

.fixed-header-full .user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fixed-header-full .user-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.fixed-header-full .user-role {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.user-role {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-admin {
  color: #dc3545;
}

.role-staff {
  color: #6c757d;
}

.mobile-world-sidebar {
  width: 300px;
  background: linear-gradient(135deg, #190a1a 0%, #3c0964 100%);
  margin-top: 0;
  display: flex;
  flex-direction: column;
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

/* User Section at Top */
.user-section-top {
  padding: 20px;
  background: rgba(60, 9, 100, 0.5);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  margin-bottom: 10px;
}

/* Menu Button in Fixed Header */
.menu-toggle-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  background: #ffffff;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 0;
  font-size: 18px;
  font-weight: normal;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.menu-toggle-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.menu-dropdown {
  position: fixed;
  top: 70px;
  right: 40px;
  min-width: 160px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0;
  padding: 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10002;
}

.menu-dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  color: #495057;
  text-decoration: none;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
  margin-bottom: 0;
}

.menu-dropdown-item:hover {
  background-color: #f8f9fa;
  color: #212529;
  transform: none;
}

.menu-dropdown-item:last-child {
  margin-bottom: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37, #b8860b);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.user-details {
  flex: 1;
}

.user-name {
  color: #d4af37;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
}

.user-role {
  color: #888;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 500;
}

.role-admin {
  color: #ff6b6b;
  font-weight: bold;
}

.role-staff {
  color: #4ecdc4;
  font-weight: bold;
}
</style>

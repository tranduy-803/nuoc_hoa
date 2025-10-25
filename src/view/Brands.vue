<template>
  <div class="brands-container">
    <!-- Filter and Search Section -->
    <div class="filter-section">
      <div class="filter-group">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-container">
            <input
              v-model="searchQuery"
              @keyup.enter="searchBrands"
              @input="handleSearchInput"
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              class="search-input"
            />
            <button @click="searchBrands" class="search-btn">
              <span>🔍</span>
              Tìm kiếm
            </button>
          </div>
          <button v-if="searchQuery" @click="resetSearch" class="reset-btn" title="Reset tìm kiếm">
            <span>↻</span>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="showAddForm = true" class="add-btn" title="Thêm thương hiệu">
            <span>➕</span>
            Thêm thương hiệu
          </button>
        </div>
      </div>
    </div>

    <!-- Brands Table -->
    <div class="table-container">
      <table class="brands-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
            <th>Mô tả</th>
            <th>Website</th>
            <th>Quốc gia</th>
            <th>Trạng thái</th>
            <!-- <th>Ngày tạo</th> -->
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in filteredBrands" :key="brand.id">
            <td>{{ brand.id }}</td>
            <td class="brand-name">{{ brand.brandName }}</td>
            <td class="brand-description">{{ brand.description || 'Không có mô tả' }}</td>
            <td>
              <a v-if="brand.website" :href="brand.website" target="_blank" class="website-link">
                {{ brand.website }}
              </a>
              <span v-else>-</span>
            </td>
            <td>{{ brand.country || '-' }}</td>
            <td>
              <span :class="brand.isActive ? 'status-active' : 'status-inactive'">
                {{ brand.isActive ? 'Hợp tác' : 'Ngừng hợp tác' }}
              </span>
            </td>
            <!-- <td>{{ formatDate(brand.createdAt) }}</td> -->
            <td class="action-buttons">
              <button @click="viewBrandDetail(brand.id)" class="detail-btn" title="Chi tiết">
                👁️
              </button>
              <button @click="editBrand(brand.id)" class="edit-btn" title="Sửa">✏️</button>
              <button @click="deleteBrand(brand.id)" class="delete-btn" title="Xóa">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Search Results Info -->
      <div v-if="searchQuery" class="search-results-info">
        <p v-if="filteredBrands.length > 0">
          Tìm thấy <strong>{{ filteredBrands.length }}</strong> thương hiệu cho từ khóa "<strong>{{
            searchQuery
          }}</strong
          >"
        </p>
        <p v-else class="no-results">
          Không tìm thấy thương hiệu nào cho từ khóa "<strong>{{ searchQuery }}</strong
          >"
        </p>
      </div>

      <!-- No Results -->
      <div v-if="!searchQuery && filteredBrands.length === 0" class="no-results">
        <p>📦 Chưa có thương hiệu nào. Hãy thêm thương hiệu đầu tiên!</p>
      </div>
    </div>

    <!-- Brand Detail Modal -->
    <div v-if="showDetailForm" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content detail-modal" @click.stop>
        <div class="modal-header">
          <h2>Chi tiết thương hiệu</h2>
          <button @click="closeDetailModal" class="close-btn">✕</button>
        </div>

        <div class="detail-content" v-if="selectedBrand">
          <!-- Brand Information Section -->
          <div class="detail-info-section">
            <div class="detail-group">
              <h4>THÔNG TIN CƠ BẢN</h4>
              <div class="detail-item">
                <label>Tên thương hiệu:</label>
                <span class="detail-value">{{ selectedBrand.brandName }}</span>
              </div>
              <div class="detail-item">
                <label>Quốc gia:</label>
                <span class="detail-value">{{ selectedBrand.country || 'Chưa cập nhật' }}</span>
              </div>
              <div class="detail-item">
                <label>Trạng thái:</label>
                <span :class="selectedBrand.isActive ? 'status-active' : 'status-inactive'">
                  {{ selectedBrand.isActive ? 'Hợp tác' : 'Ngừng hợp tác' }}
                </span>
              </div>
            </div>

            <div class="detail-group">
              <h4>MÔ TẢ</h4>
              <div class="detail-description">
                {{ selectedBrand.description || 'Chưa có mô tả' }}
              </div>
            </div>

            <div class="detail-group">
              <h4>THÔNG TIN LIÊN HỆ</h4>
              <div class="detail-item">
                <label>Website:</label>
                <span class="detail-value">
                  <a
                    v-if="selectedBrand.website"
                    :href="selectedBrand.website"
                    target="_blank"
                    class="website-link"
                  >
                    {{ selectedBrand.website }}
                  </a>
                  <span v-else>Chưa cập nhật</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeDetailModal" class="btn btn-red">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Brand Modal -->
    <div v-if="showAddForm" class="modal-overlay" @click="resetForm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingId ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới' }}</h2>
          <button @click="resetForm" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="saveBrand" class="brand-form">
          <div class="form-group">
            <label for="brandName">Tên thương hiệu *</label>
            <input
              v-model="form.brandName"
              type="text"
              id="brandName"
              required
              placeholder="Nhập tên thương hiệu..."
            />
          </div>

          <div class="form-group">
            <label for="description">Mô tả</label>
            <textarea
              v-model="form.description"
              id="description"
              rows="3"
              placeholder="Nhập mô tả thương hiệu..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="website">Website</label>
            <input
              v-model="form.website"
              type="url"
              id="website"
              placeholder="https://www.brand.com"
            />
          </div>

          <div class="form-group">
            <label for="country">Quốc gia</label>
            <input v-model="form.country" type="text" id="country" placeholder="Nhập quốc gia..." />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="form.isActive" type="checkbox" />
              <span class="checkmark"></span>
              Thương hiệu đang hoạt động
            </label>
          </div>

          <!-- Chỉ hiển thị khi edit -->

          <!-- Success Message -->
          <div v-if="showSuccessMessage" class="success-message">
            <span class="success-icon">✅</span>
            <span>{{ successMessage }}</span>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="cancel-btn">Hủy</button>
            <button type="submit" class="save-btn">
              {{ editingId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'

// Reactive data
const brands = ref([])
const allBrands = ref([])
const searchQuery = ref('')
const showAddForm = ref(false)
const showDetailForm = ref(false)
const selectedBrand = ref(null)
const editingId = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Form data
const form = reactive({
  brandName: '',
  description: '',
  website: '',
  country: '',
  isActive: true,
})

// Computed
const filteredBrands = computed(() => {
  return brands.value
})

// Methods
const fetchBrands = async () => {
  try {
    console.log('Đang gọi API brands...')
    const response = await axios.get('http://localhost:8080/api/brands')
    console.log('Response từ API:', response.data)
    brands.value = response.data
    allBrands.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách thương hiệu:', error)
    console.error('Chi tiết lỗi:', error.response?.data || error.message)
  }
}

const searchBrands = () => {
  console.log('searchBrands called with query:', searchQuery.value)
  filterBrands()
}

const handleSearchInput = () => {
  filterBrands()
}

const resetSearch = () => {
  searchQuery.value = ''
  brands.value = allBrands.value
}

// Lọc thương hiệu theo tìm kiếm
const filterBrands = () => {
  let filteredBrands = [...allBrands.value]

  // Áp dụng tìm kiếm nếu có
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filteredBrands = filteredBrands.filter((brand) => {
      const brandName = (brand.brandName || '').toLowerCase()
      const description = (brand.description || '').toLowerCase()
      const country = (brand.country || '').toLowerCase()
      return brandName.includes(query) || description.includes(query) || country.includes(query)
    })
  }

  brands.value = filteredBrands
  console.log(`Lọc thương hiệu - Kết quả: ${filteredBrands.length} thương hiệu`)
}

const viewBrandDetail = async (id) => {
  try {
    console.log('=== VIEW BRAND DETAIL DEBUG ===')
    console.log('Brand ID:', id)

    const response = await axios.get(`http://localhost:8080/api/brands/${id}`)
    const brand = response.data

    console.log('Brand data from API:', brand)

    selectedBrand.value = brand
    showDetailForm.value = true

    console.log('=== VIEW BRAND DETAIL DEBUG END ===')
  } catch (error) {
    console.error('Error fetching brand for detail:', error)
    alert('Không thể tải thông tin thương hiệu để xem chi tiết.')
  }
}

const closeDetailModal = () => {
  showDetailForm.value = false
  selectedBrand.value = null
}

const editBrand = async (id) => {
  try {
    console.log('=== EDIT BRAND DEBUG ===')
    console.log('Brand ID:', id)

    const response = await axios.get(`http://localhost:8080/api/brands/${id}`)
    const brand = response.data

    console.log('Brand data from API:', brand)

    form.brandName = brand.brandName || ''
    form.description = brand.description || ''
    form.website = brand.website || ''
    form.country = brand.country || ''
    form.isActive = brand.isActive !== undefined ? brand.isActive : true

    console.log('Form after assignment:', form)

    editingId.value = brand.id // bật chế độ cập nhật
    showAddForm.value = true // hiển thị form

    console.log('=== EDIT BRAND DEBUG END ===')
  } catch (error) {
    console.error('Error fetching brand for edit:', error)
    alert('Không thể tải thông tin thương hiệu để sửa.')
  }
}

const deleteBrand = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
    try {
      await axios.delete(`http://localhost:8080/api/brands/${id}`)
      await fetchBrands()
    } catch (error) {
      console.error('Lỗi khi xóa thương hiệu:', error)
      alert('Lỗi khi xóa thương hiệu!')
    }
  }
}

const saveBrand = async () => {
  try {
    // Tạo object để gửi
    const brandData = {
      brandName: form.brandName,
      description: form.description,
      website: form.website,
      country: form.country,
      isActive: form.isActive,
    }

    if (editingId.value === null) {
      await axios.post('http://localhost:8080/api/brands', brandData)
      alert('Thêm thương hiệu thành công!')
    } else {
      await axios.put(`http://localhost:8080/api/brands/${editingId.value}`, brandData)
      alert('Cập nhật thương hiệu thành công!')
    }

    resetForm()
    showAddForm.value = false
    await fetchBrands()

    // Reset tìm kiếm sau khi thêm/sửa thương hiệu
    resetSearch()
  } catch (error) {
    console.error('Lỗi khi lưu thương hiệu:', error)
    alert('Lỗi khi lưu thương hiệu!')
  }
}

const resetForm = () => {
  form.brandName = ''
  form.description = ''
  form.website = ''
  form.country = ''
  form.isActive = true
  editingId.value = null
  showAddForm.value = false
  showSuccessMessage.value = false
  successMessage.value = ''
}

// Lifecycle
onMounted(() => {
  fetchBrands()
})
</script>

<style scoped>
@import '../css/Brands.css';
</style>

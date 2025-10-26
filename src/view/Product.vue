<template>
  <div class="product-management">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Page Title and Breadcrumbs -->

      <!-- Filter and Search Section -->
      <div class="filter-section">
        <div class="filter-group">
          <!-- Search Section -->
          <div class="search-section">
            <div class="search-container">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearchEnter"
                @input="handleSearchInput"
                @keydown="handleSearchKeydown"
                @focus="showSuggestions = true"
                @blur="handleBlur"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="search-input"
              />
              <button @click="searchProducts" class="search-btn">
                <span>🔍</span>
                Tìm kiếm
              </button>
              <!-- Autocomplete Suggestions -->
              <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
                <div
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  @mousedown.prevent="selectSuggestion(suggestion)"
                  @click="selectSuggestion(suggestion)"
                  :class="['suggestion-item', { active: selectedSuggestionIndex === index }]"
                >
                  <span class="suggestion-text">{{ suggestion.text }}</span>
                  <span class="suggestion-type">{{ suggestion.type }}</span>
                </div>
              </div>
            </div>
            <button
              v-if="searchQuery"
              @click="resetSearch"
              class="reset-btn"
              title="Reset tìm kiếm"
            >
              <span>↻</span>
            </button>
          </div>

          <!-- Filter Section -->
          <div class="filter-section-right">
            <select v-model="selectedCategory" class="filter-select">
              <option value="">Danh mục</option>
              <option value="nam">Male</option>
              <option value="nu">Female</option>
              <option value="unisex">Unisex</option>
            </select>
            <select v-model="selectedBrand" class="filter-select">
              <option value="">Thương hiệu</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.brandName">
                {{ brand.brandName }}
              </option>
            </select>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="showAddForm = true" class="add-btn" title="Thêm sản phẩm">
                <img :src="dauCongIcon" alt="Thêm" class="add-icon" />
              </button>
              <button class="btn btn-red">
                <span>🗑️</span>
                Thùng rác
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div v-if="showAddForm" class="modal-overlay" @click="resetForm">
        <!-- Modal Content -->
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}</h3>
            <button @click="resetForm" class="modal-close">&times;</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <!-- Thông tin cơ bản -->
              <div class="form-section-title">Thông tin cơ bản</div>
              <input v-model="form.productName" type="text" placeholder="Tên sản phẩm *" required />
              <input v-model="form.productCode" type="text" placeholder="Mã sản phẩm *" required />
              <input v-model="form.description" type="text" placeholder="Mô tả sản phẩm" />

              <!-- Hình ảnh sản phẩm -->
              <div class="form-section-title">Hình ảnh sản phẩm</div>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                ref="fileInput"
                class="file-input"
              />
              <div v-if="form.productImg" class="image-preview">
                <img :src="getImageUrl(form.productImg)" alt="Preview" />
                <button @click="removeImage" class="remove-image">×</button>
              </div>

              <!-- Giá cả -->
              <div class="form-section-title">Giá cả</div>
              <div class="form-input-wrapper">
                <label for="price">Giá gốc</label>
                <input
                  v-model="form.price"
                  type="number"
                  step="0.01"
                  placeholder="Giá gốc *"
                  required
                />
              </div>
              <div class="form-input-wrapper">
                <label for="discountPrice">Giá khuyến mãi</label>
                <input
                  v-model="form.discountPrice"
                  type="number"
                  step="0.01"
                  placeholder="Giá khuyến mãi"
                />
              </div>

              <!-- Thông tin sản phẩm -->
              <div class="form-section-title">Thông tin sản phẩm</div>
              <div class="form-input-wrapper">
                <label for="quantity">Số lượng</label>
                <input v-model="form.quantity" type="number" placeholder="Số lượng *" required />
              </div>
              <div class="form-input-wrapper">
                <label for="weight">Trọng lượng</label>
                <input
                  v-model="form.weight"
                  type="number"
                  step="0.01"
                  placeholder="Trọng lượng (kg)"
                />
              </div>
              <div class="form-input-wrapper">
                <label for="volume">Dung tích</label>
                <input v-model="form.volume" type="text" placeholder="Dung tích (ml)" />
              </div>
              <div class="form-input-wrapper">
                <label for="concentration">Nồng độ</label>
                <input v-model="form.concentration" type="text" placeholder="Nồng độ" />
              </div>

              <!-- Phân loại -->
              <div class="form-section-title">Phân loại</div>

              <!-- Giới tính -->
              <div class="form-group-item">
                <label for="gender">Giới tính</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input v-model="form.gender" type="radio" value="Male" />
                    <span>Nam</span>
                  </label>
                  <label class="radio-label">
                    <input v-model="form.gender" type="radio" value="Female" />
                    <span>Nữ</span>
                  </label>
                  <label class="radio-label">
                    <input v-model="form.gender" type="radio" value="Unisex" />
                    <span>Unisex</span>
                  </label>
                </div>
              </div>

              <!-- Thương hiệu -->
              <div class="form-group-item">
                <label for="brand">Thương hiệu</label>
                <select v-model="form.brand" class="form-select">
                  <option value="">Chọn thương hiệu</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.brandName">
                    {{ brand.brandName }}
                  </option>
                </select>
              </div>

              <!-- Trạng thái -->
              <div class="form-section-title">Trạng thái</div>
              <div class="radio-group">
                <label class="radio-label">
                  <input v-model="form.status" type="radio" value="inStock" />
                  <span>Đang bán</span>
                </label>
                <label class="radio-label">
                  <input v-model="form.status" type="radio" value="outOfStock" />
                  <span>Ngừng bán</span>
                </label>
              </div>

              <!-- Sản phẩm nổi bật -->
              <div class="form-section-title">Sản phẩm nổi bật</div>
              <div class="status-group">
                <label>
                  <input v-model="form.isFeatured" type="checkbox" />
                  Sản phẩm nổi bật
                </label>
              </div>

              <!-- Thông tin bổ sung -->
              <div class="form-section-title">Thông tin bổ sung</div>
              <div class="info-note">
                <p>📊 Lượt xem được tính tự động khi khách hàng xem sản phẩm</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="addProduct" class="btn btn-green">
              {{ editingId ? 'Cập nhật' : 'Thêm mới' }}
            </button>
            <button @click="resetForm" class="btn btn-red">Hủy</button>
          </div>
        </div>
      </div>

      <!-- Search Results Info -->
      <div v-if="searchQuery" class="search-results-info">
        <p v-if="product.length > 0">
          🔍 Tìm kiếm: "<strong>{{ searchQuery }}</strong
          >" - Tìm thấy <strong>{{ product.length }}</strong> sản phẩm
        </p>
        <p v-else class="no-results">
          🔍 Tìm kiếm: "<strong>{{ searchQuery }}</strong
          >" - Không tìm thấy sản phẩm nào
        </p>
      </div>

      <!-- Product Table -->
      <div class="table-container">
        <table class="product-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>HÌNH ẢNH</th>
              <th>TÊN SẢN PHẨM</th>
              <th>MÃ SẢN PHẨM</th>
              <th>GIÁ GỐC</th>
              <!-- <th>GIÁ KM</th> -->
              <th>MÔ TẢ</th>
              <th>SỐ LƯỢNG</th>
              <!-- <th>TRỌNG LƯỢNG</th> -->
              <!-- <th>DUNG TÍCH</th> -->
              <!-- <th>NỒNG ĐỘ</th> -->
              <th>GIỚI TÍNH</th>
              <th>THƯƠNG HIỆU</th>
              <th>TÌNH TRẠNG</th>
              <!-- <th>NỔI BẬT</th> -->
              <th>LƯỢT XEM</th>
              <!-- <th>NGÀY TẠO</th> -->
              <!-- <th>NGÀY CẬP NHẬT</th> -->
              <th>CHỨC NĂNG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pr in product" :key="pr.id">
              <td>
                <input type="checkbox" />
              </td>
              <td>{{ pr.id }}</td>
              <td>
                <div class="product-image-cell">
                  <img
                    v-if="pr.productImg"
                    :src="getImageUrl(pr.productImg)"
                    :alt="pr.productName"
                    class="product-image"
                  />
                  <div v-else class="no-image">Không có ảnh</div>
                </div>
              </td>
              <td>{{ pr.productName }}</td>
              <td>{{ pr.productCode }}</td>
              <td>{{ formatPrice(pr.price) }}</td>
              <!-- <td>{{ pr.discountPrice ? formatPrice(pr.discountPrice) : '-' }}</td> -->
              <td>{{ pr.description || '-' }}</td>
              <td>{{ pr.quantity }}</td>
              <!-- <td>{{ pr.weight ? pr.weight + ' kg' : '-' }}</td> -->
              <!-- <td>{{ pr.volume || '-' }}</td> -->
              <!-- <td>{{ pr.concentration || '-' }}</td> -->
              <td>{{ pr.gender || '-' }}</td>
              <td>{{ getBrandName(pr.brand) || '-' }}</td>
              <td>
                <span :class="pr.quantity > 0 ? 'status-active' : 'status-inactive'">
                  {{ pr.quantity > 0 ? 'Đang bán' : 'Ngừng bán' }}
                </span>
              </td>
              <!-- <td>
                <span v-if="pr.isFeatured" class="featured">⭐</span>
                <span v-else>-</span>
              </td> -->
              <td>{{ pr.viewCount || 0 }}</td>

              <!-- <td>{{ formatDate(pr.createdAt) }}</td> -->
              <!-- <td>{{ formatDate(pr.updatedAt) }}</td> -->

              <td>
                <div class="action-buttons">
                  <button
                    @click="viewProductDetail(pr.id)"
                    class="btn-icon btn-green"
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>

                  <button @click="editProduct(pr.id)" class="btn-icon btn-light-blue" title="Sửa">
                    ✏️
                  </button>
                  <button @click="deleteProduct(pr.id)" class="btn-icon btn-red" title="Xóa">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail Modal Overlay -->
      <div v-if="showDetailForm" class="modal-overlay" @click="resetForm">
        <!-- Detail Modal Content -->
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Chi tiết sản phẩm</h3>
            <button @click="resetForm" class="modal-close">×</button>
          </div>

          <div class="modal-body" v-if="selectedProduct">
            <div class="product-detail">
              <!-- Product Image -->
              <div class="detail-image-section">
                <div class="product-image-large">
                  <img
                    v-if="selectedProduct.productImg"
                    :src="getImageUrl(selectedProduct.productImg)"
                    :alt="selectedProduct.productName"
                  />
                  <div v-else class="no-image">Không có hình ảnh</div>
                </div>
              </div>

              <!-- Product Information -->
              <div class="detail-info-section">
                <div class="detail-group">
                  <h4>Thông tin cơ bản</h4>
                  <div class="detail-item">
                    <label>Tên sản phẩm:</label>
                    <span>{{ selectedProduct.productName }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Mã sản phẩm:</label>
                    <span>{{ selectedProduct.productCode }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Mô tả:</label>
                    <span>{{ selectedProduct.description || 'Chưa có mô tả' }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <h4>Giá cả</h4>
                  <div class="detail-item">
                    <label>Giá gốc:</label>
                    <span class="price">{{ formatPrice(selectedProduct.price) }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.discountPrice">
                    <label>Giá khuyến mãi:</label>
                    <span class="price discount">{{
                      formatPrice(selectedProduct.discountPrice)
                    }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <h4>Thông tin sản phẩm</h4>
                  <div class="detail-item">
                    <label>Số lượng:</label>
                    <span>{{ selectedProduct.quantity }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.weight">
                    <label>Trọng lượng:</label>
                    <span>{{ selectedProduct.weight }} kg</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.volume">
                    <label>Dung tích:</label>
                    <span>{{ selectedProduct.volume }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.concentration">
                    <label>Nồng độ:</label>
                    <span>{{ selectedProduct.concentration }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <h4>Phân loại</h4>
                  <div class="detail-item" v-if="selectedProduct.gender">
                    <label>Giới tính:</label>
                    <span>{{ selectedProduct.gender }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.brand">
                    <label>Thương hiệu:</label>
                    <span>{{ getBrandName(selectedProduct.brand) }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <h4>Trạng thái</h4>
                  <div class="detail-item">
                    <label>Tình trạng:</label>
                    <span
                      :class="selectedProduct.quantity > 0 ? 'status-active' : 'status-inactive'"
                    >
                      {{ selectedProduct.quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}
                    </span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.isFeatured">
                    <label>Sản phẩm nổi bật:</label>
                    <span class="featured">⭐ Có</span>
                  </div>
                  <div class="detail-item">
                    <label>Lượt xem:</label>
                    <span>{{ selectedProduct.viewCount || 0 }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <h4>Thời gian</h4>
                  <div class="detail-item">
                    <label>Ngày tạo:</label>
                    <span>{{ formatDate(selectedProduct.createdAt) }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedProduct.updatedAt">
                    <label>Ngày cập nhật:</label>
                    <span>{{ formatDate(selectedProduct.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="resetForm" class="btn btn-red">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, onMounted, watch, onActivated } from 'vue'

import dauCongIcon from '../img/icon/dauCong.png'

// Danh sách sản phẩm
const product = ref([])
const allProducts = ref([]) // Lưu trữ danh sách sản phẩm gốc
const editingId = ref(null) // xác định đang cập nhật hay không

const showAddForm = ref(false) // hiển thị form thêm/sửa
const showDetailForm = ref(false) // hiển thị form chi tiết
const selectedProduct = ref(null) // sản phẩm được chọn để xem chi tiết
const searchQuery = ref('') // từ khóa tìm kiếm
const selectedCategory = ref('') // danh mục được chọn
const selectedBrand = ref('') // thương hiệu được chọn

// Danh sách thương hiệu từ database
const brands = ref([])

// Autocomplete
const showSuggestions = ref(false) // hiển thị gợi ý
const suggestions = ref([]) // danh sách gợi ý
const selectedSuggestionIndex = ref(-1) // index của gợi ý được chọn

// File upload
const fileInput = ref(null)

// Form sản phẩm (dùng để thêm mới)
const form = reactive({
  productName: '',
  productCode: '',
  price: 0,

  discountPrice: 0,
  description: '',

  productImg: '',
  quantity: 0,
  weight: 0,
  volume: '',
  concentration: '',
  gender: '',
  brand: '',
  status: 'inStock',
  isFeatured: false,
  viewCount: 0,
  createdAt: '',
})

// Watchers để đồng bộ status và quantity
watch(
  () => form.quantity,
  (newQuantity) => {
    if (newQuantity > 0) {
      form.status = 'inStock'
    } else {
      form.status = 'outOfStock'
    }
  },
)

watch(
  () => form.status,
  (newStatus) => {
    if (newStatus === 'outOfStock') {
      form.quantity = 0
    } else if (newStatus === 'inStock' && form.quantity === 0) {
      form.quantity = 1
    }
  },
)

// Watcher để lọc sản phẩm theo danh mục
watch(
  () => selectedCategory.value,
  (newCategory) => {
    filterProducts()
  },
)

// Watcher để lọc sản phẩm theo thương hiệu
watch(
  () => selectedBrand.value,
  (newBrand) => {
    filterProducts()
  },
)

// Lấy danh sách thương hiệu từ database
const fetchBrands = async () => {
  try {
    console.log('Fetching brands from API...')
    const response = await axios.get('http://localhost:8080/api/brands')
    console.log('Brands API Response:', response.data)
    brands.value = response.data
  } catch (error) {
    console.error('Error fetching brands:', error)
    brands.value = []
  }
}

// Lấy danh sách sản phẩm
const fetchProduct = async () => {
  try {
    console.log('Fetching products from API...')
    const response = await axios.get('http://localhost:8080/api/product/getAll')
    console.log('API Response:', response.data)
    console.log('Response type:', typeof response.data)
    console.log('Is array:', Array.isArray(response.data))
    console.log('Length:', response.data?.length)
    allProducts.value = response.data // Lưu danh sách gốc
    product.value = response.data
    console.log('Product array after assignment:', product.value)
  } catch (error) {
    console.error('Error fetching products:', error)
    console.error('Error details:', error.response?.data)
    allProducts.value = []
    product.value = []
  }
}

// Tìm kiếm sản phẩm
const searchProducts = () => {
  console.log('searchProducts called with query:', searchQuery.value)
  filterProducts()
}

// Xử lý input tìm kiếm với autocomplete
const handleSearchInput = () => {
  if (!searchQuery.value.trim()) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  generateSuggestions()
  showSuggestions.value = true
}

// Tạo gợi ý tìm kiếm
const generateSuggestions = () => {
  const query = searchQuery.value.toLowerCase().trim()
  const newSuggestions = []

  // Tìm gợi ý từ tên sản phẩm
  allProducts.value.forEach((product) => {
    const productName = (product.productName || '').toLowerCase()
    if (productName.includes(query) && productName !== query) {
      newSuggestions.push({
        text: product.productName,
        type: 'Tên sản phẩm',
        value: product.productName,
      })
    }
  })

  // Tìm gợi ý từ mã sản phẩm
  allProducts.value.forEach((product) => {
    const productCode = (product.productCode || '').toLowerCase()
    if (productCode.includes(query) && productCode !== query) {
      newSuggestions.push({
        text: product.productCode,
        type: 'Mã sản phẩm',
        value: product.productCode,
      })
    }
  })

  // Tìm gợi ý từ thương hiệu
  const uniqueBrands = [
    ...new Set(allProducts.value.map((p) => getBrandName(p.brand)).filter(Boolean)),
  ]
  uniqueBrands.forEach((brand) => {
    if (brand.toLowerCase().includes(query) && brand.toLowerCase() !== query) {
      newSuggestions.push({
        text: brand,
        type: 'Thương hiệu',
        value: brand,
      })
    }
  })

  // Loại bỏ trùng lặp và giới hạn 8 gợi ý
  const uniqueSuggestions = newSuggestions
    .filter(
      (suggestion, index, self) => index === self.findIndex((s) => s.text === suggestion.text),
    )
    .slice(0, 8)

  suggestions.value = uniqueSuggestions
}

// Xử lý phím Enter
const handleSearchEnter = () => {
  if (selectedSuggestionIndex.value >= 0 && suggestions.value[selectedSuggestionIndex.value]) {
    selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
  } else {
    searchProducts()
  }
  showSuggestions.value = false
}

// Xử lý phím mũi tên
const handleSearchKeydown = (event) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.value.length - 1,
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
    case 'Escape':
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

// Chọn gợi ý
const selectSuggestion = (suggestion) => {
  console.log('Selecting suggestion:', suggestion)
  searchQuery.value = suggestion.value
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1

  // Thực hiện tìm kiếm ngay lập tức
  setTimeout(() => {
    searchProducts()
  }, 50)
}

// Xử lý blur
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 150)
}

// Ẩn gợi ý
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 200)
}

// Reset tìm kiếm
const resetSearch = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedBrand.value = ''
  product.value = allProducts.value
  suggestions.value = []
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

// Lọc sản phẩm theo danh mục và thương hiệu
const filterProducts = () => {
  let filteredProducts = [...allProducts.value]

  // Lọc theo danh mục (giới tính)
  if (selectedCategory.value) {
    const categoryMap = {
      nam: 'Male',
      nu: 'Female',
      unisex: 'Unisex',
    }
    const genderFilter = categoryMap[selectedCategory.value]
    if (genderFilter) {
      filteredProducts = filteredProducts.filter((p) => p.gender === genderFilter)
    }
  }

  // Lọc theo thương hiệu
  if (selectedBrand.value) {
    filteredProducts = filteredProducts.filter((p) => {
      const brandName = getBrandName(p.brand)
      return brandName === selectedBrand.value
    })
  }

  // Áp dụng tìm kiếm nếu có
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filteredProducts = filteredProducts.filter((p) => {
      const productName = (p.productName || '').toLowerCase()
      const productCode = (p.productCode || '').toLowerCase()
      const brandName = getBrandName(p.brand).toLowerCase()
      return productName.includes(query) || productCode.includes(query) || brandName.includes(query)
    })
  }

  product.value = filteredProducts
  console.log(
    `Lọc sản phẩm - Danh mục: ${selectedCategory.value}, Thương hiệu: ${selectedBrand.value}, Kết quả: ${filteredProducts.length} sản phẩm`,
  )
}

// Gọi khi nhấn nút remove
// const deleteProduct = async (id) => {
//   await axios.delete(`http://localhost:8080/api/product/remove/${id}`)
//   fetchProduct() // load lại danh sách sau khi xóa
// }

const editProduct = async (id) => {
  try {
    console.log('=== EDIT PRODUCT DEBUG ===')
    console.log('Product ID:', id)

    const response = await axios.get(`http://localhost:8080/api/product/detail/${id}`)
    const p = response.data

    console.log('Product data from API:', p)
    console.log('Existing productImg:', p.productImg)

    form.productName = p.productName || ''
    form.productCode = p.productCode || ''
    form.price = p.price || 0
    form.discountPrice = p.discountPrice || 0
    form.description = p.description || ''
    form.productImg = p.productImg || ''
    form.quantity = p.quantity || 0
    form.weight = p.weight || 0
    form.volume = p.volume || ''
    form.concentration = p.concentration || ''
    form.gender = p.gender || ''

    // Map từ brand object sang brand name
    if (p.brand) {
      // Nếu là BrandDTO (có brandName)
      form.brand = p.brand.brandName || ''
    } else {
      form.brand = ''
    }

    form.status = p.quantity > 0 ? 'inStock' : 'outOfStock'
    form.isFeatured = p.isFeatured !== undefined ? p.isFeatured : false
    form.viewCount = p.viewCount || 0
    form.createdAt = p.createdAt || ''

    console.log('Form after assignment:', form)
    console.log('Form productImg after assignment:', form.productImg)

    editingId.value = p.id // bật chế độ cập nhật

    showAddForm.value = true // hiển thị form

    console.log('=== EDIT PRODUCT DEBUG END ===')
  } catch (error) {
    console.error('Error fetching product for edit:', error)
    alert('Không thể tải thông tin sản phẩm để sửa.')
  }
}

const viewProductDetail = async (id) => {
  const response = await axios.get(`http://localhost:8080/api/product/detail/${id}`)
  selectedProduct.value = response.data
  showDetailForm.value = true
}

// File upload functions
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Kiểm tra kích thước file (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB')
    return
  }

  // Kiểm tra định dạng file
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file ảnh!')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('http://localhost:8080/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    form.productImg = response.data
    console.log('Upload successful:', response.data)
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload ảnh thất bại!')
  }
}

const removeImage = () => {
  form.productImg = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Gửi request thêm sản phẩm
const addProduct = async () => {
  try {
    // Validation cơ bản
    if (!form.productName.trim()) {
      alert('Vui lòng nhập tên sản phẩm!')
      return
    }
    if (!form.productCode.trim()) {
      alert('Vui lòng nhập mã sản phẩm!')
      return
    }
    if (form.price <= 0) {
      alert('Vui lòng nhập giá sản phẩm hợp lệ!')
      return
    }
    if (form.quantity < 0) {
      alert('Vui lòng nhập số lượng hợp lệ!')
      return
    }

    // Tìm brandId từ brand name
    const selectedBrandObj = brands.value.find((b) => b.brandName === form.brand)
    const brandId = selectedBrandObj ? selectedBrandObj.id : null

    // Tạo object để gửi, loại bỏ viewCount vì nó được tính tự động
    const productData = {
      productName: form.productName,
      productCode: form.productCode,
      price: form.price,
      discountPrice: form.discountPrice,
      description: form.description,
      productImg: form.productImg,
      quantity: form.quantity,
      weight: form.weight,
      volume: form.volume,
      concentration: form.concentration,
      gender: form.gender,
      brandId: brandId,
      isFeatured: form.isFeatured,
    }

    console.log('Sending product data:', productData)

    if (editingId.value === null) {
      console.log('Adding new product...')
      await axios.post('http://localhost:8080/api/product/add', productData)
      // alert('Thêm sản phẩm thành công!')
    } else {
      console.log('Updating product with ID:', editingId.value)
      await axios.put(`http://localhost:8080/api/product/update/${editingId.value}`, productData)
      // alert('Cập nhật sản phẩm thành công!')
    }

    // Đóng form và reset
    showAddForm.value = false
    resetForm()

    // Reload dữ liệu
    await fetchProduct()

    // Reset tìm kiếm và filter sau khi thêm/sửa sản phẩm
    resetSearch()
  } catch (error) {
    console.error('Error saving product:', error)
    console.error('Error details:', error.response?.data)
    alert('Lỗi khi lưu sản phẩm: ' + (error.response?.data?.message || error.message))
  }
}

// Reset form về trạng thái ban đầu
const resetForm = () => {
  form.productName = ''
  form.productCode = ''
  form.price = 0

  form.discountPrice = 0
  form.description = ''

  form.productImg = ''
  form.quantity = 0
  form.weight = 0
  form.volume = ''
  form.concentration = ''
  form.gender = ''
  form.brand = ''
  form.status = 'inStock'
  form.isFeatured = false
  form.createdAt = ''

  editingId.value = null
  showAddForm.value = false
  showDetailForm.value = false
  selectedProduct.value = null

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// Format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Xử lý URL ảnh
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''

  // Nếu đã là URL đầy đủ, trả về nguyên
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Nếu bắt đầu với /uploads/, thêm base URL
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:8080${imagePath}`
  }

  // Nếu không có /uploads/, thêm vào
  if (!imagePath.startsWith('/uploads/')) {
    return `http://localhost:8080/uploads/${imagePath}`
  }

  return imagePath
}

// Lấy tên thương hiệu từ brand object hoặc brandId
const getBrandName = (brandOrId) => {
  if (!brandOrId) return ''

  // Nếu là object (từ relationship) - với cấu trúc mới
  if (typeof brandOrId === 'object') {
    // Nếu có brandName trực tiếp (DTO structure)
    if (brandOrId.brandName) {
      return brandOrId.brandName
    }
    // Nếu là BrandsEntity object
    if (brandOrId.brandName) {
      return brandOrId.brandName
    }
  }

  // Nếu là ID (fallback)
  if (typeof brandOrId === 'number') {
    const brand = brands.value.find((b) => b.id === brandOrId)
    return brand ? brand.brandName : ''
  }

  return ''
}

// Gọi API khi component được mount
onMounted(() => {
  fetchBrands()
  fetchProduct()
})

// Reload brands khi component được activate (khi quay lại từ trang khác)
onActivated(() => {
  // Kiểm tra nếu có thương hiệu mới được thêm từ trang khác
  const lastBrandUpdate = localStorage.getItem('lastBrandUpdate')
  const currentTime = Date.now()

  // Nếu có update trong vòng 30 giây qua, reload brands
  if (lastBrandUpdate && currentTime - parseInt(lastBrandUpdate) < 30000) {
    console.log('Detected recent brand update, reloading brands...')
    fetchBrands()
  }
})

// Reload brands khi component được activate (khi quay lại từ trang khác)
const reloadBrands = () => {
  fetchBrands()
}

// Expose function để có thể gọi từ bên ngoài
defineExpose({
  reloadBrands,
})
</script>

<style src="@/css/SanPham.css"></style>

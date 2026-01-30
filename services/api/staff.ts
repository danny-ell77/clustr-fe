import { apiClient } from '~/lib/api-client'
import type { Staff, StaffFilters, CreateStaffDto, UpdateStaffDto, StaffStatistics } from '~/types/shifts'

export const staffService = {
  /**
   * Get list of staff members
   */
  async getStaff(filters?: StaffFilters) {
    const response = await apiClient.get('/management/shift/staff/', { params: filters })
    return response.data
  },

  /**
   * Get a single staff member by ID
   */
  async getStaffMember(id: string) {
    const response = await apiClient.get(`/management/shift/staff/${id}/`)
    return response.data
  },

  /**
   * Get staff statistics
   */
  async getStaffStats() {
    const response = await apiClient.get('/management/shift/staff/statistics/')
    return response.data
  },

  /**
   * Create a new staff member
   */
  async createStaff(data: CreateStaffDto) {
    const response = await apiClient.post('/management/shift/staff/', data)
    return response.data
  },

  /**
   * Update a staff member
   */
  async updateStaff(id: string, data: UpdateStaffDto) {
    const response = await apiClient.patch(`/management/shift/staff/${id}/`, data)
    return response.data
  },

  /**
   * Deactivate a staff member
   */
  async deactivateStaff(id: string) {
    const response = await apiClient.post(`/management/shift/staff/${id}/deactivate/`)
    return response.data
  },

  /**
   * Activate a staff member
   */
  async activateStaff(id: string) {
    const response = await apiClient.post(`/management/shift/staff/${id}/activate/`)
    return response.data
  },

  /**
   * Get shifts for a staff member
   */
  async getStaffShifts(id: string, filters?: { status?: string; start_date?: string; end_date?: string }) {
    const response = await apiClient.get(`/management/shift/staff/${id}/shifts/`, { params: filters })
    return response.data
  },

  /**
   * Export staff to CSV
   */
  async exportStaff(filters?: StaffFilters) {
    const response = await apiClient.get('/management/shift/staff/export/', { 
      params: filters,
      responseType: 'blob'
    })
    return response.data
  }
}

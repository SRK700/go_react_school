// models/TeacherRepository.go
package models

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TeacherRepository handles database operations related to the Teacher model.
type TeacherRepository struct {
	Db *gorm.DB
}

// NewTeacherRepository creates a new instance of TeacherRepository.
func NewTeacherRepository(db *gorm.DB) *TeacherRepository {
	return &TeacherRepository{Db: db}
}

// GetTeachers retrieves all Teachers from the database and returns them as JSON.
func (r *TeacherRepository) GetTeachers(c *gin.Context) {
	var teachers []Teacher
	r.Db.Find(&teachers)
	c.JSON(200, teachers)
}

// GetTeacher retrieves a Teacher from the database based on the given ID and returns it as JSON.
func (r *TeacherRepository) GetTeacher(c *gin.Context) {
	id := c.Param("id")
	var teacher Teacher
	r.Db.First(&teacher, id)
	c.JSON(200, teacher)
}

// CreateTeacher adds a new Teacher to the database and returns it as JSON.
func (r *TeacherRepository) CreateTeacher(c *gin.Context) {
	var newTeacher Teacher
	c.BindJSON(&newTeacher)
	r.Db.Create(&newTeacher)
	c.JSON(200, newTeacher)
}

// UpdateTeacher updates an existing Teacher in the database and returns it as JSON.
func (r *TeacherRepository) UpdateTeacher(c *gin.Context) {
	id := c.Param("id")
	var teacher Teacher
	r.Db.First(&teacher, id)
	c.BindJSON(&teacher)
	r.Db.Save(&teacher)
	c.JSON(200, teacher)
}

// DeleteTeacher deletes a Teacher from the database based on the given ID and returns a JSON response.
func (r *TeacherRepository) DeleteTeacher(c *gin.Context) {
	id := c.Param("id")
	var teacher Teacher
	r.Db.Delete(&teacher, id)
	c.JSON(200, gin.H{"id" + id: "is deleted"})
}
func (r *TeacherRepository) SearchTeachers(c *gin.Context) {
    // ดึงค่า query parameters
    firstName := c.Query("firstName")
    lastName := c.Query("lastName")
    age := c.Query("age")
    salary := c.Query("salary")

    // สร้างตัวแปรเพื่อเก็บข้อมูลครู
    var teachers []Teacher

    // คิวรีข้อมูลครูจากฐานข้อมูล โดยใช้ query parameters ที่ระบุ
    query := r.Db
    if firstName != "" {
        query = query.Where("first_name LIKE ?", "%"+firstName+"%")
    }
    if lastName != "" {
        query = query.Where("last_name LIKE ?", "%"+lastName+"%")
    }
    if age != "" {
        query = query.Where("age = ?", age)
    }
    if salary != "" {
        query = query.Where("salary = ?", salary)
    }
    query.Find(&teachers)

    // ส่งข้อมูลครูที่ค้นหาได้กลับเป็น JSON
    c.JSON(http.StatusOK, teachers)
}
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Space, Table } from "antd";
import api from "../../utils/api";
import CategoryForm from "./categoryForm";
import { AuthContext } from "../../utils/auth";
import SubcategoryForm from "./subcategoryForm";

export default function Read() {
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [mode, setMode] = useState("create");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    api
      .get("/categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  };

  const onDelete = (id) => {
    //TODO: Modal de confirmacion de eliminacion
    api
      .delete(`/categories/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        fetchCategories();
      })
      .catch((error) => {
        // ToDo: Mensaje de error
        console.error("Error al eliminar la categoría:", error);
      });
  };

  const handleEdit = (category) => {
    setMode("edit");
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedCategory(null);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

  const handleSave = (categoryData) => {
    setIsModalVisible(false);
    setSelectedCategory(null);
    if (mode === "create") {
      api
        .post(
          "/categories/create",
          {
            name: categoryData.name,
            description: categoryData.description,
            image: categoryData.image,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          fetchCategories();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    } else {
      api
        .put(`/categories/edit/${categoryData._id}`, {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image,
        })
        .then((response) => {
          fetchCategories();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    }
  };

  // Redirect to admin topic list
  function handleSubcategoryClick(subcat) {}

  function handleSubcategoryModalCancel() {
    setIsSubcategoryModalVisible(false);
    setSelectedSubcategory(null);
  }

  const handleEditSubcategory = (subcategory) => {
    setMode("edit");
    setSelectedSubcategory(subcategory);
    setIsSubcategoryModalVisible(true);
  };

  const handleCreateSubcategory = (catID) => {
    setMode("create");
    setSelectedSubcategory({ category: catID });
    setIsSubcategoryModalVisible(true);
  };

  const handleDeleteSubcategory = (subcategory) => {
    // Aquí puedes mostrar un modal de confirmación y luego eliminar la subcategoría.
  };

  const handleSubcategorySave = (subcategoryData) => {
    setIsModalVisible(false);
    setSelectedCategory(null);
    if (mode === "create") {
      api
        .post(
          "/subcategories/create",
          {
            name: subcategoryData.name,
            category: subcategoryData.category,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          fetchCategories();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    } else {
      //TODO: Editar la subcategoría
      console.log("Edit sub");
      /*api.put(`/subcategories/edit/${categoryData._id}`, {
                name: categoryData.name,
                description: categoryData.description
            })
                .then((response) => {
                    fetchCategories();
                })
                .catch((error) => {
                    console.error("Create error:", error);
                })*/
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Subcategories",
      key: "subcategories",
      dataIndex: "subcategories",
      render: (_, { subcategories }) => (
        <>
          {subcategories.map((subcat) => (
            <div key={subcat._id}>
              <p>
                <a onClick={() => handleSubcategoryClick(subcat)}>
                  {subcat.name}
                </a>
              </p>
              <Space>
                <button onClick={() => handleEditSubcategory(subcat)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteSubcategory(subcat)}>
                  Delete
                </button>
              </Space>
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, cat) => (
        <Space size="middle">
          <button onClick={() => handleEdit(cat)}>Edit {cat.name}</button>
          <button onClick={() => handleCreateSubcategory(cat._id)}>
            Add new subcategory
          </button>
          <button onClick={() => onDelete(cat._id)}>Delete</button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleCreate}>
        Create Category
      </Button>
      <Table columns={columns} dataSource={categories}></Table>

      <Modal
        title={selectedCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <CategoryForm category={selectedCategory} onSave={handleSave} />
      </Modal>

      <Modal
        title={selectedSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        open={isSubcategoryModalVisible}
        onCancel={handleSubcategoryModalCancel}
        footer={null}
      >
        <SubcategoryForm
          subcategory={selectedSubcategory}
          onSave={handleSubcategorySave}
        />
      </Modal>
    </div>
  );
}

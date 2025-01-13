import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

export const SzallasDel = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [szallas, setSzallas] = useState(null);
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    setPending(true);
    (async () => {
      try {
        console.log(`Fetching data for ID: ${id}`);
        const res = await axios.get(`https://szallasjwt.sulla.hu/data/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        console.log(res.data);
        setSzallas(res.data);
      } catch (error) {
        console.log("Error fetching data:", error);
        if (error.response) {
          console.log("Error response:", error.response.status);
          console.log("Error message:", error.response.data);
        }
      } finally {
        setPending(false);
      }
    })();
  }, [id]);

  const handleDelete = (event) => {
    event.preventDefault();
    console.log(`Deleting data with ID: ${id}`);
    axios
      .delete(`https://szallasjwt.sulla.hu/data/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then(() => {
        console.log("Item deleted successfully");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        if (error.response) {
          console.log("Error response:", error.response.status);
          console.log("Error message:", error.response.data);
        }
      });
  };

  return (
    <div className="p-5 m-auto text-center content bg-lavender">
      {isPending || !szallas ? (
        <div className="spinner-border"></div>
      ) : (
        <div className="card p-3">
          <div className="card-body">
            <h5 className="card-title">Törlendő elem: {szallas.name}</h5>
            <div className="lead">Szállásadó neve: {szallas.hostname}</div>
            <div className="lead">Szállás helye: {szallas.location}</div>
            <div className="lead">Ár: {szallas.price}</div>
            <div className="lead">
              Minimum foglalható éjszakák: {szallas.minimum_nights}
            </div>
          </div>
          <form onSubmit={handleDelete}>
            <div>
              <NavLink to="/SzallasList" className="btn btn-secondary">
                &nbsp;Mégsem
              </NavLink>
              &nbsp;&nbsp;
              <button type="submit" className="bi bi-trash btn btn-danger">
                &nbsp;Törlés
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

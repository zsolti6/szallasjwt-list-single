import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import "./SzallasList.css";

export const SzallasSingle = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const vantaRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Nem található JWT token!");
        }
        const valasz = await axios.get(
          "https://szallasjwt.sulla.hu/data/" + id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(valasz.data);
      } catch (error) {
        setError(
          "Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve?"
        );
        console.error("Hiba az adatok lekérése során: ", error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const vantaEffect = NET({
      el: vantaRef.current,
      THREE,
      color: 0xff0000,
      backgroundColor: 0xffffff,
      points: 12.0,
      maxDistance: 20.0,
      spacing: 18.0,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);
  return (
    <div id="vanta-container" ref={vantaRef} style={{ minHeight: "100vh" }}>
      <div id="content">
        <h2>Szállások listája</h2>
        {error && <p style={{ color: "red" }}> {error} </p>}
        {data ? (
          <ul>
            <li key={data.id}>
              {data.name} - {data.hostname} - {data.location} - {data.price} -{" "}
              {data.minimum_nights}
              <Link to={"/SzallasList"}>
                <i className="bi bi-backspace fs-6 btn btn-primary"></i>
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Link to={"/data-mod/" + data.id}>
                <i className="bi bi-pencil-square fs-6 btn btn-warning"></i>
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Link to={"/data-del/" + data.id}>
                <i className="bi bi-trash3 fs-6 btn btn-danger"></i>
              </Link>
              <br />
              <br />
            </li>
          </ul>
        ) : (
          <p>Nem találhatók az adatok!</p>
        )}
      </div>
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export const SzallasCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5 content bg-whitesmoke text-center">
      <h2>Új szállás</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const token = localStorage.getItem("jwt");
          if (!token) {
            navigate("/login");
            return;
          }

          const formData = {
            name: event.target.elements.name.value,
            hostname: event.target.elements.hostname.value,
            location: event.target.elements.location.value,
            price: event.target.elements.price.value,
            minimum_nights: event.target.elements.minimum_nights.value,
          };

          axios
            .post("https://szallasjwt.sulla.hu/data/", formData, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              navigate("/");
            })
            .catch((error) => {
              console.error("Error:", error.response?.data || error);
              if (error.response?.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/login");
              }
            });
        }}
      >
        <div className="form-group row pb-3">
          <label className="col-sm-3 col-form-label">Szállás neve:</label>
          <div className="col-sm-9">
            <input type="text" name="name" className="form-control" />
          </div>
        </div>
        <div className="form-group row pb-3">
          <label className="col-sm-3 col-form-label">Szállásadó neve:</label>
          <div className="col-sm-9">
            <input type="text" name="hostname" className="form-control" />
          </div>
        </div>
        <div className="form-group row pb-3">
          <label className="col-sm-3 col-form-label">Szállás helye:</label>
          <div className="col-sm-9">
            <input type="text" name="location" className="form-control" />
          </div>
        </div>
        <div className="form-group row pb-3">
          <label className="col-sm-3 col-form-label">Ár:</label>
          <div className="col-sm-9">
            <input type="number" name="price" className="form-control" />
          </div>
        </div>
        <div className="form-group row pb-3">
          <label className="col-sm-3 col-form-label">
            Minimum foglalható éjszakák:
          </label>
          <div className="col-sm-9">
            <input
              type="number"
              name="minimum_nights"
              className="form-control"
            />
          </div>
        </div>
        <Link
          to="/SzallasList"
          className="bi bi-backspace-fill fs-5 btn btn-danger"
        >
          Vissza
        </Link>
        &nbsp;&nbsp;&nbsp;
        <button type="submit" className="bi bi-send btn btn-success fs-5">
          Küldés
        </button>
      </form>
    </div>
  );
};

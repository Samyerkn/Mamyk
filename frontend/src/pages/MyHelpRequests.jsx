import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyHelpRequests } from "../services/requests";
import "../styles/Requests.css";

function MyHelpRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadMyRequests = async () => {
      try {
        const data = await fetchMyHelpRequests();
        setRequests(data);
      } catch (err) {
        setError("Не удалось загрузить ваши заявки.");
      } finally {
        setLoading(false);
      }
    };

    loadMyRequests();
  }, []);


  const getStatus = (status) => {
    if (status === "pending") return "Ожидает";
    if (status === "in_progress") return "В процессе";
    if (status === "completed") return "Завершено";

    return status;
  };


  const getFastening = (type) => {
    if(type === "buttons") return "На кнопках";
    if(type === "magnets") return "На магнитах";
    if(type === "velcro") return "На липучках";

    return type;
  };


  return (
    <div className="requests-page">


      <div className="requests-header">

        <span className="requests-tag">
          MAMYK CARE
        </span>

        <h1>
          Мои заявки
        </h1>

        <p>
          Здесь отображаются созданные вами заявки
          на помощь ребёнку.
        </p>


        <button
          className="primary-button"
          onClick={() => navigate("/requests/new")}
        >
          Новая заявка
        </button>

      </div>



      {loading && (
        <p className="loading-text">
          Загрузка...
        </p>
      )}


      {error && (
        <p className="page-error">
          {error}
        </p>
      )}



      {!loading && requests.length === 0 && (
        <div className="empty-box">
          У вас пока нет заявок.
          Создайте первую, чтобы получить помощь.
        </div>
      )}



      <div className="request-list">

        {requests.map((request)=>{


          const percent =
            request.amount_needed > 0
            ? Math.min(
                100,
                (request.amount_collected /
                request.amount_needed) * 100
              )
            : 0;



          return (

            <div
              key={request.id}
              className="request-card"
              onClick={() =>
                navigate(`/requests/${request.id}`)
              }
            >


              <span className="card-tag">
                Моя заявка
              </span>



              <div className="request-card-header">

                <div>

                  <h2>
                    {request.child_name}
                  </h2>


                  <p className="diagnosis">
                    {request.diagnosis}
                  </p>

                </div>



                <span
                  className={`status-pill status-${request.status}`}
                >
                  {getStatus(request.status)}
                </span>

              </div>




              <p className="request-story">

                {request.story
                  ? request.story.length > 170
                    ? request.story.slice(0,170) + "..."
                    : request.story
                  : "Описание заявки отсутствует"}

              </p>




              <div className="request-info">


                <div className="info-item">

                  <span className="info-title">
                    Тип одежды
                  </span>

                  <strong>
                    👕 {getFastening(request.fastening_type)}
                  </strong>

                </div>



                <div className="info-item">

                  <span className="info-title">
                    Размер
                  </span>

                  <strong>
                    📏 {request.size}
                  </strong>

                </div>


              </div>




              <div className="progress-row">


                <div className="progress-bar-outer">

                  <div
                    className="progress-bar-inner"
                    style={{
                      width:`${percent}%`
                    }}
                  />

                </div>


                <span>
                  {Math.round(percent)}%
                </span>


              </div>




              <div className="money-box">


                <div>

                  <span>
                    Собрано
                  </span>


                  <strong>
                    {Number(
                      request.amount_collected
                    ).toLocaleString("ru-RU")} ₸
                  </strong>

                </div>




                <div>

                  <span>
                    Необходимо
                  </span>


                  <strong>
                    {Number(
                      request.amount_needed
                    ).toLocaleString("ru-RU")} ₸
                  </strong>


                </div>


              </div>



            </div>

          );

        })}


      </div>


    </div>
  );
}


export default MyHelpRequests;
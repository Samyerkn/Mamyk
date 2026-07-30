import { useEffect, useState } from "react";
import { fetchMyDonations } from "../services/requests";
import "../styles/Requests.css";

function SponsorHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchMyDonations();
        setDonations(data);
      } catch (err) {
        setError("Не удалось загрузить историю помощи.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);



  const totalDonated = donations.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );



  return (
    <div className="requests-page">


      <div className="requests-header">

        <span className="requests-tag">
          MAMYK CARE
        </span>


        <h1>
          История помощи
        </h1>


        <p>
          Здесь вы можете увидеть все ваши пожертвования
          и вклад в помощь детям.
        </p>

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




      {!loading && donations.length === 0 && (

        <div className="empty-box">
          Пока нет внесённых пожертвований.
        </div>

      )}






      {donations.length > 0 && (

        <>


          <div className="donation-summary-card">

  <span>
    Всего помогли на сумму
  </span>

  <div className="donation-total">

    <strong>
      {totalDonated.toLocaleString("ru-RU")}
    </strong>

    <span className="currency">
      ₸
    </span>

  </div>

</div>





          <div className="donation-history-card">


            {donations.map((donation)=>(


              <div
                key={donation.id}
                className="donation-row"
              >


                <div>


                  <div className="donation-history-title">

                    ❤️ Помощь ребёнку

                  </div>



                  <div className="muted">

                    {new Date(
                      donation.created_at
                    ).toLocaleString("ru-RU")}

                  </div>


                </div>





                <div className="donation-history-right">


                  <strong>

                    {Number(
                      donation.amount
                    ).toLocaleString("ru-RU")} ₸

                  </strong>




                  {donation.is_full_payment && (

                    <span className="pill">
                      Полная оплата
                    </span>

                  )}



                </div>


              </div>


            ))}


          </div>


        </>

      )}



    </div>
  );
}


export default SponsorHistory;
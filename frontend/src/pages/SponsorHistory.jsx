import { useEffect, useState } from "react";
import Header from "../components/Header";
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

  const totalDonated = donations.reduce((sum, donation) => sum + Number(donation.amount), 0);

  return (
    <>
      <Header />
      <div className="requests-page">
        <h1>История помощи</h1>
        {loading && <p>Загрузка...</p>}
        {error && <p className="page-error">{error}</p>}
        {!loading && !donations.length && <p>Пока нет внесённых донатов.</p>}

        {donations.length > 0 && (
          <>
            <div className="donation-summary">
              <strong>Всего пожертвовано:</strong> {totalDonated} ₸
            </div>
            <div className="donation-history-card">
              {donations.map((donation) => (
                <div key={donation.id} className="donation-row">
                  <div>
                    <div className="donation-history-title">Заявка #{donation.help_request}</div>
                    <div className="muted">{new Date(donation.created_at).toLocaleString()}</div>
                  </div>
                  <div className="donation-history-right">
                    <strong>{donation.amount} ₸</strong>
                    {donation.is_full_payment && <span className="pill">Полная оплата</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SponsorHistory;

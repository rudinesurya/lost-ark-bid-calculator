import React, { useEffect, useState } from "react";
import { Container, Dropdown, Form, Grid, Header, Segment } from 'semantic-ui-react';

const appName = 'lost-ark-bid-calculator';

const Dashboard: React.FC = () => {
    const [marketPrice, setMarketPrice] = useState("");
    const [bid, setBid] = useState(0);
    const [participants, setParticipants] = useState("");
    const [profit, setProfit] = useState(0);
    const [profitEachOtherPerson, setProfitEachOtherPerson] = useState(0);

    const [altBidAmount, setAltBidAmount] = useState(0);
    const [nextAltBidAmount, setNextAltBidAmount] = useState(0);
    const [altProfit, setAltProfit] = useState(0);
    const [altProfitEachOtherPerson, setAltProfitEachOtherPerson] = useState(0);

    const raidSizeOptions = [
        { key: '4', text: '4', value: '4' },
        { key: '8', text: '8', value: '8' },
        { key: '16', text: '16', value: '16' },
        { key: '32', text: '32', value: '32' },
    ];

    useEffect(() => {
        // Get the value from local storage if it exists
        const savedMarketPriceAmount = localStorage.getItem(`${appName}-marketPrice`) || "0";
        setMarketPrice(savedMarketPriceAmount);

        const savedParticipants = localStorage.getItem(`${appName}-participants`) || "4";
        setParticipants(savedParticipants);
    }, []);

    useEffect(() => {
        const calculateProfit = () => {
            const numMarketPrice = Number(marketPrice);
            const numParticipants = Number(participants);

            if (isNaN(numMarketPrice) || isNaN(numParticipants) || numParticipants <= 1) {
                return;
            }

            const costOfItemAfterTax = 0.95 * numMarketPrice;
            const amountToBid = costOfItemAfterTax * ((numParticipants - 1) / numParticipants);
            setBid(Math.floor(amountToBid));

            setProfit(Math.floor(costOfItemAfterTax - amountToBid));
            setProfitEachOtherPerson(Math.floor(amountToBid / (numParticipants - 1)));

            // calculate alt
            const altAmountToBid = (101 / 110) * amountToBid;
            setAltBidAmount(Math.floor(altAmountToBid));
            setNextAltBidAmount(Math.floor(1.1 * altAmountToBid));

            setAltProfit(Math.floor(costOfItemAfterTax - altAmountToBid));
            setAltProfitEachOtherPerson(Math.floor(altAmountToBid / (numParticipants - 1)));

            localStorage.setItem(`${appName}-marketPrice`, marketPrice.toString());
            localStorage.setItem(`${appName}-participants`, participants.toString());
        };

        calculateProfit();
    }, [participants, marketPrice]);

    return (
        <Container text style={{ paddingTop: '2em' }}>
            <Header as="h1" textAlign="center">Lost Ark Bid Calculator</Header>
            <Segment>
                <Form>
                    <Grid stackable columns={2}>
                        <Grid.Column width={16}>
                            <Form.Field>
                                <label>Market Price</label>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={marketPrice}
                                    onChange={(e) => setMarketPrice(e.target.value)}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Raid Size</label>
                                <Dropdown
                                    placeholder='Raid Size'
                                    fluid
                                    selection
                                    options={raidSizeOptions}
                                    value={participants}
                                    onChange={(e, { value }) => setParticipants(value.toString())}
                                />
                            </Form.Field>
                        </Grid.Column>

                    </Grid>
                </Form>
            </Segment>

            {/* Result Section */}
            <Segment>
                <Header as="h3">Your Calculated Bid:</Header>

                <div style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    padding: "1em",
                    marginTop: "1em",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}>
                    <Header as="h4">Equal Profit</Header>
                    <p>
                        <strong>Amount to bid:</strong> {bid} Gold
                    </p>
                    <p>
                        <strong>Your profit:</strong> {profit} Gold
                    </p>
                    <p>
                        <strong>Other player's profit:</strong> {profitEachOtherPerson} Gold
                    </p>
                </div>

                <div style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    padding: "1em",
                    marginTop: "1em",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}>
                    <Header as="h4" style={{ color: "#333" }}>Max Profit!</Header>
                    <p>
                        <strong>Amount to bid:</strong> {altBidAmount} Gold
                    </p>
                    <p>
                        <strong>Next bid would become:</strong> {nextAltBidAmount} Gold
                    </p>
                    <p>
                        <strong>Your profit:</strong> {altProfit} Gold
                    </p>
                    <p>
                        <strong>Other player's profit:</strong> {altProfitEachOtherPerson} Gold
                    </p>
                </div>

            </Segment>

        </Container>
    );
};

export default Dashboard;

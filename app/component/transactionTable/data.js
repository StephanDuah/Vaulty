import { getSellersTransaction } from "@/app/action/TransactionAction";
export const getData = async (id) => {
  try {
    const transaction = await getSellersTransaction(id);

    return transaction.map(
      ({ _id, buyerDetail, totalAmount, transactionStatus }) => {
        return {
          id: _id,
          buyer: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
          amount: totalAmount,
          status: transactionStatus,
        };
      }
    );
  } catch (error) {
    console.log(error);
  }
};

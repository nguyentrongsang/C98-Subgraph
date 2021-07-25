# C98-Subgraph
Subgraph for querying c98 token infomation

1) yarn install
2) graph codegen && graph build 

Query example:
1. Contract info
```
{
  userCounters {
    id
    count
  }
  transferCounters {
    count
    totalTransferredGwei
  }
  tokenInfos{
    name
    totalSupplyGwei
  }
}
```
2. User info
```
{
  users(first: 10, orderBy:balanceGwei, orderDirection: desc) {
    id
    address
    balanceGwei
    transactionCount
  }
}
```
or
```
{
  users(first: 10, orderBy:transactionCount, orderDirection: desc) {
    id
    address
    balanceGwei
    transactionCount
  }
}
```

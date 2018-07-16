# Test Cases

MetadiumIdentityManager
each test must have test about permission

# createMetaID
when not contracts are linked
 reverts
when contracts are linked
 when not permissioned
  reverts
 when permissioned
  when metaPakcage length is not correct
   reverts
  when metaPakcage length is correct
   when address from ecverify using signature(metaID) 
    doesn't match address from metaPackage
     reverts
    matches address from metaPackage
     when MetaID already exists
      reverts
     when MetaID not exists
      createMetaID(mint)
      emit CreateMetaID event
   


# deleteMetaID
when not contracts are linked
 reverts
when contracts are linked
 when not permissioned
  reverts
 when permissioned
  when address from ecverifyWithTimestamp dosen't match address from the ownerOf metaID
    revert
   when address from ecverifyWithTimestamp matches address from ownerOf metaID
    deletenMetaID(burn)
    emit DeleteMetaID event


# updateMetaID
when not contracts are linked
 reverts
when contracts are linked
 when not permissioned
  reverts
 when permissioned
  when address from metaPackage dosen't match ownerOf metaID
    reverts
   when address from metaPackage matches ownerOf metaID
    when address from ecverity using newMetaID doesn't match address from metaPackage
      reverts
     when address from ecverity using newMetaID matches
      when newMetaID already exists
       reverts
      when newMetaID do not exist
       burn old metaID and mint new metaID
       emit UpdateMetaID event


# restoreMetaID
when not contracts are linked
 reverts
when contracts are linked
 when not permissioned
  reverts
 when permissioned
  when ownerOf oldMetaID doesn't match oldAddress
   reverts
  when ownerOf oldMetaID matches oldAddress
   when address from metaPacakge doesn't match address from newMetaSig
    reverts
   when address from metaPacakge matches address from newMetaSig
    when newMetaID alreay exists
     reverts
    when newMetaID do not exists
     burn old MetaID and mint new MetaID
     emit RestoreMetaID event

# Basic functions
when not contracts are linked
 ownerOf reverts
 tokenURI reverts
 tokenURIAsBytes reverts
 balanceOf reverts
 tokenOfOwnerByIndex reverts



-----------------------
ownerOf

tokenURI

tokenURIAsBytes

balanceOf

tokenOfOwnerByIndex

ecverify

ecverifyWithTimestamp

getAddressFromMetaPackage

setMetadiumNameServiceAddress
------------------------


/*
MetadiumNameService

setContractDomain
getContractAddress
setPermission
getPermission

*/


/*
MetaID

mint
burn
tokenURIAsBytes
transferFrom
safeTransferFrom1
safeTransferFrom2
approve
setApprovalForAll

*/